import api from "../config/ApiConfig";

export const getAvailableOrders = async () => {
  const response = await api.get("/rider/available-orders");
  return response.data;
};

export const acceptOrder = async (orderId) => {
  const response = await api.post(`/rider/accept-order/${orderId}`);
  return response.data;
};

export const rejectOrder = async (orderId) => {
  const response = await api.post(`/rider/reject-order/${orderId}`);
  return response.data;
};

export const getCurrentDelivery = async () => {
  const response = await api.get("/rider/current-delivery");
  return response.data;
};

export const updateDeliveryStatus = async (orderId, status) => {
  const response = await api.patch(`/rider/delivery/${orderId}/status`, { status });
  return response.data;
};

export const getDeliveryHistory = async () => {
  const response = await api.get("/rider/delivery-history");
  return response.data;
};
