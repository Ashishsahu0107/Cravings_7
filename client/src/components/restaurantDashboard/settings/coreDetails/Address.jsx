import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../../../context/AuthContext";
import api from "../../../../config/ApiConfig";
import toast from "react-hot-toast";
import RunningLoader from "../../../../assets/loadingAnimation.gif";

const Address = () => {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [loadingRestaurantError, setLoadingRestaurantError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  
  const [addressFormData, setAddressFormData] = useState({
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    geoLat: "",
    geoLon: "",
  });

  const fetchRestaurantData = async () => {
    try {
      setIsLoadingRestaurant(true);
      const res = await api.get(
        `/restaurant/get-restaurant-data`, { params: { id: user._id } }
      );
      setRestaurantData(res.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setRestaurantData(null);
      } else {
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
      setAddressFormData({
        address: restaurantData.address || "",
        city: restaurantData.city || "",
        state: restaurantData.state || "",
        pinCode: restaurantData.pinCode || "",
        country: restaurantData.country || "",
        geoLat: restaurantData.geoLocation?.lat || "",
        geoLon: restaurantData.geoLocation?.lon || "",
      });
    }
  }, [restaurantData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await api.put("/restaurant/update-core-details", addressFormData);
      toast.success(res.data.message || "Address updated successfully");
      setRestaurantData(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update address",
      );
    } finally {
      setIsLoading(false);
      setEditingAddress(false);
    }
  };

  const handleCancel = () => {
    if (restaurantData) {
      setAddressFormData({
        address: restaurantData.address || "",
        city: restaurantData.city || "",
        state: restaurantData.state || "",
        pinCode: restaurantData.pinCode || "",
        country: restaurantData.country || "",
        geoLat: restaurantData.geoLocation?.lat || "",
        geoLon: restaurantData.geoLocation?.lon || "",
      });
    }
    setEditingAddress(false);
  };

  return (
    <>
      {isLoadingRestaurant ? (
        <div className="flex flex-col justify-center items-center h-40">
          <img src={RunningLoader} alt="Loading..." className="w-20 h-20" />
          <span className="text-sm text-(--color-primary) font-semibold mt-2 animate-bounce">
            Fetching Address
          </span>
        </div>
      ) : loadingRestaurantError ? (
        <div className="flex flex-col justify-center items-center h-40">
          <span className="text-sm text-(--color-error) font-semibold mt-2">
            {loadingRestaurantError}
          </span>
        </div>
      ) : (
        <div className="bg-(--color-base-100) rounded-lg p-3 mb-2">
          <div className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-2">
            <div className="flex items-center gap-3">
              <h3 className="w-full text-sm font-semibold text-(--color-primary)">
                Address
              </h3>
            </div>

            {!editingAddress ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingAddress(true)}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
                >
                  <MdEdit /> Edit
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-(--color-secondary) text-(--color-secondary-content) px-2 py-0.5 rounded text-xs"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <fieldset
            disabled={!editingAddress}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center items-center border-0 p-0 m-0"
          >
            <div className="w-full">
              <label className="text-xs font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={addressFormData.address}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">City</label>
              <input
                type="text"
                name="city"
                value={addressFormData.city}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">State</label>
              <input
                type="text"
                name="state"
                value={addressFormData.state}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">Pin Code</label>
              <input
                type="text"
                name="pinCode"
                value={addressFormData.pinCode}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">Country</label>
              <input
                type="text"
                name="country"
                value={addressFormData.country}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>

            <div className="w-full grid grid-cols-2 gap-2">
              <div className="w-full">
                <label className="text-xs font-semibold">Latitude</label>
                <input
                  type="text"
                  name="geoLat"
                  value={addressFormData.geoLat}
                  onChange={handleChange}
                  placeholder="e.g. 28.6139"
                  className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                />
              </div>

              <div className="w-full">
                <label className="text-xs font-semibold">Longitude</label>
                <input
                  type="text"
                  name="geoLon"
                  value={addressFormData.geoLon}
                  onChange={handleChange}
                  placeholder="e.g. 77.2090"
                  className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingAddress ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                />
              </div>
            </div>
          </fieldset>
        </div>
      )}
    </>
  );
};

export default Address;
