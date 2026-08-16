import React, { useState } from "react";
import { useRider } from "../../../context/RiderContext";
import { updateRiderOnlineStatus } from "../../../services/riderService";
import { emitStatusChange } from "../../../services/socketService";
import toast from "react-hot-toast";

const OnlineStatusToggle = ({ isCompact = false }) => {
  const { onlineStatus, setOnlineStatus, currentDelivery } = useRider();
  const [isLoading, setIsLoading] = useState(false);
  
  const isOnline = onlineStatus === "online" || onlineStatus === "busy" || onlineStatus === "on_delivery";

  const handleToggle = async () => {
    if (isLoading) return;
    
    // Prevent going offline if on delivery
    if (isOnline && currentDelivery) {
      toast.error("You cannot go offline while on an active delivery.");
      return;
    }

    const newStatus = isOnline ? "offline" : "online";
    
    try {
      setIsLoading(true);
      await updateRiderOnlineStatus(newStatus);
      setOnlineStatus(newStatus);
      
      const userStr = sessionStorage.getItem("cravingUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        emitStatusChange(user._id, newStatus);
      }
      
      toast.success(`You are now ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompact) {
    return (
      <button 
        onClick={handleToggle}
        disabled={isLoading}
        className={`relative flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-300 ${isOnline ? "bg-success" : "bg-base-300"}`}
      >
        <span className={`absolute w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isOnline ? "translate-x-3" : "-translate-x-3"}`}></span>
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggle}
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-xl font-bold flex justify-between items-center transition-all duration-300 ${
        isOnline 
          ? "bg-success/10 text-success border border-success/20 hover:bg-success/20" 
          : "bg-base-300 text-base-content hover:bg-base-300/80"
      }`}
    >
      <span className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>}
          <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? "bg-success" : "bg-neutral"}`}></span>
        </span>
        {isOnline ? "Online" : "Offline"}
      </span>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${isOnline ? "bg-success" : "bg-neutral"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isOnline ? "right-0.5" : "left-0.5"}`}></div>
      </div>
    </button>
  );
};

export default OnlineStatusToggle;
