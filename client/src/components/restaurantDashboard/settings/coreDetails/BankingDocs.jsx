import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../../../context/AuthContext";
import api from "../../../../config/ApiConfig";
import toast from "react-hot-toast";
import RunningLoader from "../../../../assets/loadingAnimation.gif";

const BankingDocs = () => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [loadingRestaurantError, setLoadingRestaurantError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [editingBanking, setEditingBanking] = useState(false);

  const [bankingFormData, setBankingFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    panCard: "",
    gst: "",
    fssai: "",
  });

  const fetchRestaurantData = async () => {
    try {
      setIsLoadingRestaurant(true);
      const res = await api.get(`/restaurant/get-restaurant-data`, {
        params: { id: user._id },
      });
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
      setBankingFormData({
        bankName: restaurantData.financialDetails?.bankName || "",
        accountNumber: restaurantData.financialDetails?.accountNumber || "",
        ifscCode: restaurantData.financialDetails?.ifscCode || "",
        panCard: restaurantData.financialDetails?.panCard || "",
        gst: restaurantData.financialDetails?.gst || "",
        fssai: restaurantData.financialDetails?.fssai || "",
      });
    }
  }, [restaurantData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankingFormData({
      ...bankingFormData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await api.put(
        "/restaurant/update-core-details",
        bankingFormData,
      );
      toast.success(
        res.data.message || "Banking & Documents updated successfully",
      );
      setRestaurantData(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update banking details",
      );
    } finally {
      setIsLoading(false);
      setEditingBanking(false);
    }
  };

  const handleCancel = () => {
    if (restaurantData) {
      setBankingFormData({
        bankName: restaurantData.financialDetails?.bankName || "",
        accountNumber: restaurantData.financialDetails?.accountNumber || "",
        ifscCode: restaurantData.financialDetails?.ifscCode || "",
        panCard: restaurantData.financialDetails?.panCard || "",
        gst: restaurantData.financialDetails?.gst || "",
        fssai: restaurantData.financialDetails?.fssai || "",
      });
    }
    setEditingBanking(false);
  };

  return (
    <>
      {isLoadingRestaurant ? (
        <div className="flex flex-col justify-center items-center h-40">
          <img src={RunningLoader} alt="Loading..." className="w-20 h-20" />
          <span className="text-sm text-(--color-primary) font-semibold mt-2 animate-bounce">
            Fetching Banking Information
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
                Banking & Documents
              </h3>
            </div>

            {!editingBanking ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBanking(true)}
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
            disabled={!editingBanking}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-center items-center border-0 p-0 m-0"
          >
            <div className="w-full">
              <label className="text-xs font-semibold">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={bankingFormData.bankName}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={bankingFormData.accountNumber}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={bankingFormData.ifscCode}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">Pan Card Number</label>
              <input
                type="text"
                name="panCard"
                value={bankingFormData.panCard}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">GST Number</label>
              <input
                type="text"
                name="gst"
                value={bankingFormData.gst}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>

            <div className="w-full">
              <label className="text-xs font-semibold">fssai Code</label>
              <input
                type="text"
                name="fssai"
                value={bankingFormData.fssai}
                onChange={handleChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingBanking ? "bg-white" : "bg-(--color-base-100)"} rounded`}
              />
            </div>
          </fieldset>
        </div>
      )}
    </>
  );
};

export default BankingDocs;
