import api from "../config/ApiConfig";

export const getRiderProfile = async () => {
  const response = await api.get("/rider/profile");
  return response.data;
};

export const getRiderOverview = async () => {
  const response = await api.get("/rider/overview");
  return response.data;
};

export const updateRiderOnlineStatus = async (status) => {
  const response = await api.patch(`/rider/online-status/${status}`);
  return response.data;
};

export const getRiderPerformance = async () => {
  const response = await api.get("/rider/performance");
  return response.data;
};
