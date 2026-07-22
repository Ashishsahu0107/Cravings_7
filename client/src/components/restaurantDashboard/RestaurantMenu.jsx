import React, { useState, useEffect, useRef } from "react";
import { MdOutlineAdd, MdClose, MdImage } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import RunningLoader from "../../assets/loadingAnimation.gif";

const RestaurantMenu = () => {
  const { user } = useAuth();
  
  const [menuList, setMenuList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [addMenuModal, setAddMenuModal] = useState(false);

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

  const handleAddMenu = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.imageFile) {
      toast.error("Please fill all required fields and upload an image");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("itemName", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("image", formData.imageFile);

      const res = await api.post("/restaurant/add-dish", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Menu added successfully");
        setMenuList(res.data.data); // Update with new list from backend
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add menu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-(--color-base-200) min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-(--color-primary)">Menu Management</h1>
          <p className="text-sm text-(--color-secondary-content)">Add and manage your restaurant's dishes</p>
        </div>
        <button
          onClick={() => setAddMenuModal(true)}
          className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-5 py-2.5 rounded-lg font-medium shadow hover:-translate-y-0.5 transition-transform"
        >
          <MdOutlineAdd className="text-xl" />
          Add New Menu
        </button>
      </div>

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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {menuList.map((item, index) => (
            <div
              key={index}
              className="bg-(--color-base-100) rounded-2xl overflow-hidden border border-(--color-secondary)/20 shadow-sm hover:shadow-md transition-shadow group flex flex-col"
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
                <div className="text-xs font-medium text-(--color-primary) uppercase tracking-wider mb-1">
                  {item.category}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                  {item.itemName}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 flex-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Menu Modal */}
      {addMenuModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-(--color-base-100) rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Add New Dish</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
            
            <form onSubmit={handleAddMenu} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Margherita Pizza"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) outline-none transition-all bg-white text-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Main Course"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) outline-none transition-all bg-white text-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) outline-none transition-all bg-white text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the ingredients and flavor..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-(--color-primary)/50 focus:border-(--color-primary) outline-none transition-all resize-none bg-white text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dish Image *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.imagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="h-32 w-auto rounded-lg object-cover shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, imageFile: null, imagePreview: "" }));
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
                        >
                          <MdClose size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <MdImage className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-(--color-primary) hover:text-(--color-primary)/80 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              ref={fileInputRef}
                              onChange={handleImageChange}
                              required
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-(--color-primary) text-(--color-primary-content) font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Dish"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
