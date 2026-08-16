import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { connectSocket, disconnectSocket, joinRiderRoom } from "../services/socketService";

const RiderContext = createContext();

export const RiderProvider = ({ children }) => {
  const { user, isLogin, role } = useAuth();
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [pendingOrderRequest, setPendingOrderRequest] = useState(null);

  useEffect(() => {
    if (isLogin && role === "rider" && user?._id) {
      const socket = connectSocket();
      
      socket.on("connect", () => {
        setSocketConnected(true);
        joinRiderRoom(user._id);
      });

      socket.on("disconnect", () => {
        setSocketConnected(false);
      });

      // Fetch initial rider state from API could happen here

      return () => {
        disconnectSocket();
      };
    }
  }, [isLogin, role, user]);

  const value = {
    onlineStatus,
    setOnlineStatus,
    currentDelivery,
    setCurrentDelivery,
    socketConnected,
    pendingOrderRequest,
    setPendingOrderRequest
  };

  return <RiderContext.Provider value={value}>{children}</RiderContext.Provider>;
};

export const useRider = () => useContext(RiderContext);
