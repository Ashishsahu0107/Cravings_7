import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../../../context/AuthContext";
import api from "../../../../config/ApiConfig";
import toast from "react-hot-toast";
import RunningLoader from "../../../../assets/loadingAnimation.gif";

const RestaurantInfo = () => {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [loadingRestaurantError, setLoadingRestaurantError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(false);
  
  const [restaurantFormData, setRestaurantFormData] = useState({
    restaurantName: "",
    description: "",
    restaurantType: "",
    cuisineTypes: "",
    isOpen: false,
    contactEmail: "",
    contactPhone: "",
    openingTime: "",
    closingTime: "",
  });

  const fetchRestaurantData = async () => {
    try {
      setIsLoadingRestaurant(true);
      const res = await api.get(
        `/restaurant/get-restaurant-data?id=${user._id}`,
      );
      setRestaurantData(res.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setRestaurantData(null);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Unknown error occurred fetching restaurant. Please try again.",
        );
        setLoadingRestaurantError(
          error.response?.data?.message ||
            "Unknown error occurred fetching restaurant. Please try again.",
        );
      }
    } finally {
      setIsLoadingRestaurant(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [user]);

  useEffect(() => {
    if (restaurantData) {
      setRestaurantFormData({
        restaurantName: restaurantData.restaurantName || "",
        description: restaurantData.description || "",
        restaurantType: restaurantData.restaurantType || "",
        cuisineTypes: restaurantData.cuisineTypes?.join(", ") || "",
        isOpen: restaurantData.isOpen || false,
        contactEmail: restaurantData.contactDetails?.email || "",
        contactPhone: restaurantData.contactDetails?.phone || "",
        openingTime: restaurantData.servingHours?.openingTime || "",
        closingTime: restaurantData.servingHours?.closingTime || "",
      });
    }
  }, [restaurantData]);

  const handleRestaurantChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurantFormData({
      ...restaurantFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveRestaurant = async () => {
    try {
      setIsLoading(true);

      const res = await api.put("/restaurant/update-restaurant-info", restaurantFormData);
      
      toast.success(res.data.message || "Restaurant info updated successfully");
      
      // Update local state with the returned data
      setRestaurantData(res.data.data);
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update restaurant",
      );
    } finally {
      setIsLoading(false);
      setEditingRestaurant(false);
    }
  };

  const handleCancelRestaurant = () => {
    if (restaurantData) {
      setRestaurantFormData({
        restaurantName: restaurantData.restaurantName || "",
        description: restaurantData.description || "",
        restaurantType: restaurantData.restaurantType || "",
        cuisineTypes: restaurantData.cuisineTypes?.join(", ") || "",
        isOpen: restaurantData.isOpen || false,
        contactEmail: restaurantData.contactDetails?.email || "",
        contactPhone: restaurantData.contactDetails?.phone || "",
        openingTime: restaurantData.servingHours?.openingTime || "",
        closingTime: restaurantData.servingHours?.closingTime || "",
      });
    }
    setEditingRestaurant(false);
  };

  return (
    <>
      {isLoadingRestaurant ? (
        <div className="flex flex-col justify-center items-center h-64">
          <img src={RunningLoader} alt="Loading..." className="w-40 h-40" />
          <span className="text-lg text-(--color-primary) font-semibold mt-2 animate-bounce">
            Fetching Restaurant Information
          </span>
        </div>
      ) : loadingRestaurantError ? (
        <div className="flex flex-col justify-center items-center h-64">
          <span className="text-lg text-(--color-error) font-semibold mt-2">
            {loadingRestaurantError}
          </span>
        </div>
      ) : (
        <div className="bg-(--color-base-100) rounded-lg p-3">
          <div className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-2">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-(--color-primary)">
                Restaurant Information
              </h3>
            </div>

            {!editingRestaurant ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingRestaurant(true)}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
                >
                  <MdEdit /> Edit
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleSaveRestaurant}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelRestaurant}
                  className="flex items-center gap-2 bg-(--color-secondary) text-(--color-secondary-content) px-2 py-0.5 rounded text-xs"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center items-center">
            <div className="w-full">
              <label className="text-xs font-semibold">Restaurant Name</label>
              <input
                type="text"
                name="restaurantName"
                value={restaurantFormData?.restaurantName || ""}
                onChange={handleRestaurantChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurant ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                disabled={!editingRestaurant}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">Restaurant Type</label>
              <select
                name="restaurantType"
                value={restaurantFormData?.restaurantType || ""}
                onChange={handleRestaurantChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurant ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                disabled={!editingRestaurant}
              >
                <option value="">Select type</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="jain">Jain</option>
                <option value="vegan">Vegan</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="w-full">
              <label className="text-xs font-semibold">
                Cuisine Types{" "}
                <span className="font-normal text-(--color-secondary)">
                  (comma-separated)
                </span>
              </label>
              <input
                type="text"
                name="cuisineTypes"
                value={restaurantFormData?.cuisineTypes || ""}
                onChange={handleRestaurantChange}
                placeholder="e.g. Indian, Chinese, Italian"
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurant ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                disabled={!editingRestaurant}
              />
            </div>

            <div className="w-full">
              <label className="text-xs font-semibold">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={restaurantFormData?.contactEmail || ""}
                onChange={handleRestaurantChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurant ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                disabled={!editingRestaurant}
              />
            </div>

            <div className="w-full">
              <label className="text-xs font-semibold">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={restaurantFormData?.contactPhone || ""}
                onChange={handleRestaurantChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurant ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                disabled={!editingRestaurant}
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-2">
              <div className="w-full">
                <label className="text-xs font-semibold">Opening Time</label>
                <input
                  type="time"
                  name="openingTime"
                  value={restaurantFormData?.openingTime || ""}
                  onChange={handleRestaurantChange}
                  className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurant ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                  disabled={!editingRestaurant}
                />
              </div>

              <div className="w-full">
                <label className="text-xs font-semibold">Closing Time</label>
                <input
                  type="time"
                  name="closingTime"
                  value={restaurantFormData?.closingTime || ""}
                  onChange={handleRestaurantChange}
                  className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurant ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                  disabled={!editingRestaurant}
                />
              </div>
            </div>

            <div className="w-full col-span-1 md:col-span-3">
              <label className="text-xs font-semibold">Description</label>
              <textarea
                name="description"
                value={restaurantFormData?.description || ""}
                onChange={handleRestaurantChange}
                rows={2}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingRestaurant ? "bg-white" : "bg-(--color-base-100)"} rounded resize-none`}
                disabled={!editingRestaurant}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantInfo;