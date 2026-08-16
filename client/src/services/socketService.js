import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true,
      reconnectionDelayMax: 10000,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToNewOrders = (callback) => {
  if (!socket) return;
  socket.on("new_order_available", callback);
};

export const unsubscribeFromNewOrders = () => {
  if (!socket) return;
  socket.off("new_order_available");
};

export const emitLocationUpdate = (riderId, lat, lon) => {
  if (!socket) return;
  socket.emit("rider_location_update", { riderId, lat, lon });
};

export const emitStatusChange = (riderId, status) => {
  if (!socket) return;
  socket.emit("rider_status_change", { riderId, status });
};

export const joinRiderRoom = (riderId) => {
  if (!socket) return;
  socket.emit("join_rider", riderId);
};
