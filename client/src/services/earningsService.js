import api from "../config/ApiConfig";

export const getEarnings = async () => {
  const response = await api.get("/rider/earnings");
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get("/rider/transactions");
  return response.data;
};
