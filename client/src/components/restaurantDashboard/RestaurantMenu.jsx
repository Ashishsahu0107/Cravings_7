import React, { useState, useEffect, useRef } from "react";
import { MdOutlineAdd, MdImage, MdEdit, MdVisibility, MdDelete, MdStar, MdStarBorder, MdThumbUp, MdOutlineThumbUp, MdNewReleases, MdOutlineNewReleases, MdViewList, MdGridView, MdSearch } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import RunningLoader from "../../assets/loadingAnimation.gif";
import AddNewItemModal from "./restaurants/AddNewItemModal";
import EditorViewModal from "./restaurants/EditorViewModal";
import ComfirmModal from "./restaurants/ComfirmModal";

const RestaurantMenu = () => {
  const { user } = useAuth();
  
  const [menuList, setMenuList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [addMenuModal, setAddMenuModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [viewMenuModal, setViewMenuModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, itemId: null });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageFile: null,
    imagePreview: "",
    
  });

  const fileInputRef = useRef(null);

  const fetchMenu = async () => {
    try {
      setIsFetching(true);
      const res = await api.get("/restaurant/get-menu");
      if (res.data && res.data.success) {
        setMenuList(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch menu");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleCloseModal = () => {
    setAddMenuModal(false);
    setIsEditMode(false);
    setEditItemId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      imageFile: null,
      imagePreview: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenEditModal = (item) => {
    setIsEditMode(true);
    setEditItemId(item._id);
    setFormData({
      name: item.itemName,
      description: item.description,
      price: item.price,
      category: item.category,
      imageFile: null,
      imagePreview: item.image?.url || "",
    });
    setAddMenuModal(true);
  };

  const handleOpenViewModal = (item) => {
    setViewItem(item);
    setViewMenuModal(true);
  };

  const handleCloseViewModal = () => {
    setViewMenuModal(false);
    setViewItem(null);
  };

  const openDeleteConfirm = (itemId) => {
    setConfirmModal({ isOpen: true, itemId });
  };

  const executeDeleteMenu = async () => {
    const itemId = confirmModal.itemId;
    if (!itemId) return;
    
    try {
      const res = await api.delete(`/restaurant/delete-dish/${itemId}`);
      if (res.data.success) {
        setMenuList(res.data.data);
        toast.success("Dish deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete dish");
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const res = await api.patch(`/restaurant/toggle-status/${itemId}`, {
        isAvailable: newStatus
      });
      if (res.data.success) {
        setMenuList(res.data.data);
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleBadgeChange = async (itemId, field, value) => {
    try {
      const res = await api.patch(`/restaurant/toggle-status/${itemId}`, {
        [field]: value
      });
      if (res.data.success) {
        setMenuList(res.data.data);
        toast.success("Badge updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update badge");
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!isEditMode && !formData.imageFile) {
      toast.error("Please upload an image for the new dish");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("itemName", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }

      let res;
      if (isEditMode) {
        res = await api.put(`/restaurant/edit-dish/${editItemId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await api.post("/restaurant/add-dish", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (res.data.success) {
        toast.success(isEditMode ? "Menu updated successfully" : "Menu added successfully");
        setMenuList(res.data.data); // Update with new list from backend
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || (isEditMode ? "Failed to update menu" : "Failed to add menu"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMenu = menuList.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.itemName?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 bg-(--color-base-200) min-h-[83vh]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--color-primary)">Menu Management</h1>
          <p className="text-sm text-(--color-secondary-content)">Add and manage your restaurant's dishes</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <MdSearch size={20} />
            </div>
            <input
              type="text"
              placeholder="Search dishes, types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 focus:border-(--color-primary) transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 transition-colors ${viewMode === "table" ? "bg-(--color-primary) text-white" : "text-gray-500 hover:bg-gray-50"}`}
                title="Table View"
              >
                <MdViewList size={20} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-(--color-primary) text-white" : "text-gray-500 hover:bg-gray-50"}`}
                title="Grid View"
              >
                <MdGridView size={20} />
              </button>
            </div>
            <button
              onClick={() => setAddMenuModal(true)}
              className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-5 py-2.5 rounded-lg font-medium shadow hover:-translate-y-0.5 transition-transform"
            >
              <MdOutlineAdd className="text-xl" />
              Add New Menu
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6"></div>

      {isFetching ? (
        <div className="flex flex-col justify-center items-center h-64">
          <img src={RunningLoader} alt="Loading..." className="w-20 h-20" />
          <span className="text-sm text-(--color-primary) font-semibold mt-2 animate-bounce">
            Fetching Menu...
          </span>
        </div>
      ) : menuList.length === 0 ? (
        <div className="bg-(--color-base-100) rounded-2xl border border-(--color-secondary)/20 shadow-sm p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-(--color-primary)/10 rounded-full flex items-center justify-center text-(--color-primary) mb-4">
            <MdOutlineAdd className="text-3xl" />
          </div>
          <h3 className="text-lg font-semibold text-(--color-primary)">No menu items yet</h3>
          <p className="text-(--color-secondary-content) mt-1 max-w-sm mx-auto">
            Get started by adding your first delicious dish to the menu.
          </p>
          <button
            onClick={() => setAddMenuModal(true)}
            className="mt-6 px-6 py-2 bg-transparent border-2 border-(--color-primary) text-(--color-primary) rounded-lg font-medium hover:bg-(--color-primary) hover:text-(--color-primary-content) transition-colors"
          >
            Add Menu Item
          </button>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-(--color-base-100) rounded-2xl shadow-sm border border-(--color-secondary)/20 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-primary uppercase tracking-wider">
                <th className="p-4">Item Image</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Item Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-center">Badges</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMenu.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      {item.image && item.image.url ? (
                        <img src={item.image.url} alt={item.itemName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <MdImage size={24} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{item.itemName}</div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {item.category}
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    ${item.price?.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <select
                      value={item.isAvailable}
                      onChange={(e) => handleStatusChange(item._id, e.target.value === 'true')}
                      className={`text-sm px-3 py-1.5 rounded-lg border font-medium outline-none cursor-pointer ${
                        item.isAvailable
                          ? 'bg-green-50 text-green-700 border-green-200 focus:ring-2 focus:ring-green-500/20'
                          : 'bg-red-50 text-red-700 border-red-200 focus:ring-2 focus:ring-red-500/20'
                      }`}
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <MdStar className="text-lg" />
                      <span className="font-semibold text-gray-700">{item.rating > 0 ? item.rating.toFixed(1) : "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleBadgeChange(item._id, "isTopRated", !item.isTopRated)}
                        className={`p-1.5 rounded-full transition-colors ${item.isTopRated ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Top Rated"
                      >
                        {item.isTopRated ? <MdStar size={18} /> : <MdStarBorder size={18} />}
                      </button>
                      <button
                        onClick={() => handleBadgeChange(item._id, "isRecommended", !item.isRecommended)}
                        className={`p-1.5 rounded-full transition-colors ${item.isRecommended ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Recommended"
                      >
                        {item.isRecommended ? <MdThumbUp size={18} /> : <MdOutlineThumbUp size={18} />}
                      </button>
                      <button
                        onClick={() => handleBadgeChange(item._id, "isNew", !item.isNew)}
                        className={`p-1.5 rounded-full transition-colors ${item.isNew ? 'text-purple-500 bg-purple-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="New Item"
                      >
                        {item.isNew ? <MdNewReleases size={18} /> : <MdOutlineNewReleases size={18} />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenViewModal(item)}
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View"
                      >
                        <MdVisibility size={20} />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Edit"
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(item._id)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredMenu.map((item, index) => (
            <div
              key={index}
              className="bg-(--color-base-100) rounded-2xl overflow-hidden border border-(--color-secondary)/20 shadow-sm hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
              onClick={() => handleOpenViewModal(item)}
            >
              <div className="relative h-48 bg-gray-100">
                {item.image && item.image.url ? (
                  <img
                    src={item.image.url}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <MdImage size={40} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                  ${item.price?.toFixed(2)}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-(--color-primary) uppercase tracking-wider">
                      {item.category}
                    </div>
                    {item.isNew && (
                      <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                    <MdStar /> {item.rating > 0 ? item.rating.toFixed(1) : "N/A"}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                  {item.itemName}
                </h3>
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                  <select
                    value={item.isAvailable}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleStatusChange(item._id, e.target.value === 'true');
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-colors outline-none cursor-pointer ${
                      item.isAvailable 
                        ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' 
                        : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    }`}
                  >
                    <option value="true">Available</option>
                    <option value="false">Out of Stock</option>
                  </select>
                  <div className="flex gap-1 items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBadgeChange(item._id, "isTopRated", !item.isTopRated);
                      }}
                      className={`p-1 rounded transition-colors ${item.isTopRated ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title="Top Rated"
                    >
                      {item.isTopRated ? <MdStar size={16} /> : <MdStarBorder size={16} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBadgeChange(item._id, "isRecommended", !item.isRecommended);
                      }}
                      className={`p-1 rounded transition-colors ${item.isRecommended ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title="Recommended"
                    >
                      {item.isRecommended ? <MdThumbUp size={16} /> : <MdOutlineThumbUp size={16} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBadgeChange(item._id, "isNew", !item.isNew);
                      }}
                      className={`p-1 rounded transition-colors ${item.isNew ? 'text-purple-500 bg-purple-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title="New Item"
                    >
                      {item.isNew ? <MdNewReleases size={16} /> : <MdOutlineNewReleases size={16} />}
                    </button>
                  </div>
                  <div className="flex gap-1 border-l pl-2 ml-1 border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(item);
                      }}
                      className="text-gray-500 hover:text-emerald-600 transition-colors p-1 rounded hover:bg-emerald-50"
                      title="Edit"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteConfirm(item._id);
                      }}
                      className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddNewItemModal
        isOpen={addMenuModal}
        onClose={handleCloseModal}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        handleAddMenu={handleAddMenu}
        isSubmitting={isSubmitting}
        fileInputRef={fileInputRef}
      />

      <EditorViewModal
        isOpen={viewMenuModal}
        onClose={handleCloseViewModal}
        viewItem={viewItem}
      />

      <ComfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, itemId: null })}
        onConfirm={executeDeleteMenu}
        message="Are you sure you want to delete this dish?"
      />
    </div>
  );
};

export default RestaurantMenu;
