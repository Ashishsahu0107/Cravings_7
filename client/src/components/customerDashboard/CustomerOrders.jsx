import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Loader from "../Loader";

const CustomerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);

        if (user?._id) {
          const res = await api.get(`/order/customer/${user._id}`);
          if (res.data.success) {
            setOrders(res.data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
        toast.error("Failed to load your orders");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "badge-warning";
      case "accepted": return "badge-info";
      case "preparing": return "badge-warning";
      case "ready": return "badge-success";
      case "pickedUp": return "badge-info";
      case "onTheWay": return "badge-primary";
      case "delivered": return "badge-success";
      case "cancelled": return "badge-error";
      case "failed": return "badge-error";
      case "rejected": return "badge-error";
      case "undeliverable": return "badge-error";
      default: return "badge-neutral";
    }
  };

  if(isLoading){
    return (
      <>
        <Loader/>
      </>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <h2 className="text-2xl font-bold text-primary mb-6">My Orders</h2>
      <div className="bg-base-200 p-4 rounded-lg">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary">
                <th className="text-left py-2">Order ID</th>
                <th className="text-left py-2">Restaurant</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr className="border-b border-secondary">
                  <td colSpan="5" className="text-center py-4 text-neutral">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-secondary transition-colors">
                    <td className="py-3 font-mono text-xs font-bold text-gray-500">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                    <td className="py-3 font-medium text-gray-800">
                      {order.restaurantId?.restaurantName || "Unknown Restaurant"}
                    </td>
                    <td className="py-3 font-semibold text-orange-600">
                      ₹{order.billDetails?.finalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-3">
                      <span className={`badge ${getStatusColor(order.orderStatus)} badge-sm w-20  font-semibold capitalize`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;
