import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

import ResturantCoreDetails from "./settings/coreDetails/Index";
import RestaurantPhotos from "./settings/RestaurantPhotos";
import Information from "./settings/restaurantInformation/Index";

const RestaurantSetting = () => {
  const { user } = useAuth();
  const tabs = [
    { id: "information", label: "Information" },
    { id: "coreDetails", label: "Core Details" },
    { id: "photos", label: "Photos" },
  ];

  const [activeTab, setActiveTab] = useState("information");
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/restaurant/get-restaurant-data', {
          params: { id: user._id }
        });
        if (res.data.data) {
          setIsRestaurantOpen(res.data.data.isOpen);
        }
      } catch (error) {
        // ignore if not found
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || "Failed to fetch restaurant status");
        }
      }
    };
    if (user?._id) fetchStatus();
  }, [user]);

  // create a api for the restaurant  open and close
  const handleRestaurantOpen = async () => {
    try {
      const newStatus = !isRestaurantOpen;
      // Optimistic UI update
      setIsRestaurantOpen(newStatus);
      const res = await api.patch(`/restaurant/update-open-status/${newStatus}`);
      toast.success(res.data.message || "Status updated successfully");
    } catch (error) {
      // Revert on error
      setIsRestaurantOpen(isRestaurantOpen);
      toast.error(error.response?.data?.message || "Failed to update restaurant open status");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-secondary/50 flex justify-between items-center pb-3">
        {/* Tabs */}
        <div className="flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md uppercase text-sm font-medium transition-all duration-300 cursor-pointer
                ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-content shadow-md"
                    : "hover:bg-base-300"
                  }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Open / Close Switch */}
        <div className="flex items-center gap-4">
          {/* Animated Status */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isRestaurantOpen ? "open" : "closed"}
              initial={{ opacity: 0, y: -15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow
                ${
                  isRestaurantOpen
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {/* Animated Dot */}
              <motion.span
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                }}
                className={`w-3 h-3 rounded-full ${
                  isRestaurantOpen ? "bg-green-500" : "bg-red-500"
                }`}
              />

              {isRestaurantOpen ? "Restaurant Open" : "Restaurant Closed"}
            </motion.div>
          </AnimatePresence>

          {/* Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isRestaurantOpen}
              onChange={handleRestaurantOpen}
              className="sr-only peer"
            />

            <div
              className="
                w-14 h-7
                bg-gray-300
                rounded-full
                transition-all
                duration-300
                peer-checked:bg-green-500

                after:content-['']
                after:absolute
                after:top-1
                after:left-1
                after:w-5
                after:h-5
                after:bg-white
                after:rounded-full
                after:transition-all
                after:duration-300

                peer-checked:after:translate-x-7
              "
            />
          </label>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 mt-4 rounded-lg bg-(--color-base-200)"
      >
        {activeTab === "information" && <Information />}
        {activeTab === "coreDetails" && <ResturantCoreDetails />}
        {activeTab === "photos" && <RestaurantPhotos />}
      </motion.div>
    </div>
  );
};

export default RestaurantSetting;
