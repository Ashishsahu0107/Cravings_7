import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../../../context/AuthContext";
import api from "../../../../config/ApiConfig";
import toast from "react-hot-toast";
import RunningLoader from "../../../../assets/loadingAnimation.gif";

const LegalInfo = () => {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLegal, setIsLoadingLegal] = useState(false);
  const [loadingLegalError, setLoadingLegalError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [editingLegal, setEditingLegal] = useState(false);
  
  const [legalFormData, setLegalFormData] = useState({
    legalName: "",
    companyType: "",
  });

  const fetchLegalData = async () => {
    try {
      setIsLoadingLegal(true);
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
            "Unknown error occurred fetching legal info. Please try again.",
        );
        setLoadingLegalError(
          error.response?.data?.message ||
            "Unknown error occurred fetching legal info. Please try again.",
        );
      }
    } finally {
      setIsLoadingLegal(false);
    }
  };

  useEffect(() => {
    fetchLegalData();
  }, [user]);

  useEffect(() => {
    if (restaurantData) {
      setLegalFormData({
        legalName: restaurantData.legalName || "",
        companyType: restaurantData.companyType || "",
      });
    }
  }, [restaurantData]);

  const handleLegalChange = (e) => {
    const { name, value } = e.target;
    setLegalFormData({
      ...legalFormData,
      [name]: value,
    });
  };

  const handleSaveLegal = async () => {
    try {
      setIsLoading(true);

      const res = await api.put("/restaurant/update-legal-info", legalFormData);
      
      toast.success(res.data.message || "Legal info updated successfully");
      
      // Update local state with the returned data
      setRestaurantData(res.data.data);
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update legal information",
      );
    } finally {
      setIsLoading(false);
      setEditingLegal(false);
    }
  };

  const handleCancelLegal = () => {
    if (restaurantData) {
      setLegalFormData({
        legalName: restaurantData.legalName || "",
        companyType: restaurantData.companyType || "",
      });
    }
    setEditingLegal(false);
  };

  return (
    <>
      {isLoadingLegal ? (
        <div className="flex flex-col justify-center items-center h-64">
          <img src={RunningLoader} alt="Loading..." className="w-40 h-40" />
          <span className="text-lg text-(--color-primary) font-semibold mt-2 animate-bounce">
            Fetching Legal Information
          </span>
        </div>
      ) : loadingLegalError ? (
        <div className="flex flex-col justify-center items-center h-64">
          <span className="text-lg text-(--color-error) font-semibold mt-2">
            {loadingLegalError}
          </span>
        </div>
      ) : (
        <div className="bg-(--color-base-100) rounded-lg p-3">
          <div className="flex justify-between items-center border-b border-(--color-secondary) pb-2 mb-2">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-(--color-primary)">
                Legal Information
              </h3>
            </div>

            {!editingLegal ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingLegal(true)}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
                >
                  <MdEdit /> Edit
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleSaveLegal}
                  className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded text-xs"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelLegal}
                  className="flex items-center gap-2 bg-(--color-secondary) text-(--color-secondary-content) px-2 py-0.5 rounded text-xs"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="text-xs font-semibold">Legal Name</label>
              <input
                type="text"
                name="legalName"
                value={legalFormData?.legalName || ""}
                onChange={handleLegalChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingLegal ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                disabled={!editingLegal}
              />
            </div>
            <div className="w-full">
              <label className="text-xs font-semibold">Company Type</label>
              <input
                type="text"
                name="companyType"
                value={legalFormData?.companyType || ""}
                onChange={handleLegalChange}
                className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingLegal ? "bg-white" : "bg-(--color-base-100)"} rounded`}
                disabled={!editingLegal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LegalInfo;