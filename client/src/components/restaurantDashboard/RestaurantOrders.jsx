import React, { useEffect, useState } from "react";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import Select from "../ui/Select";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/restaurant-manager");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/order/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success("Order status updated!");
        // Update local state
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      }
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Could not update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-amber-600 bg-amber-100";
      case "accepted":
      case "preparing":
      case "ready": return "text-blue-600 bg-blue-100";
      case "pickedUp":
      case "onTheWay":
      case "delivered": return "text-emerald-600 bg-emerald-100";
      case "cancelled":
      case "failed":
      case "rejected":
      case "undeliverable": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const orderStatuses = [
    "pending", "accepted", "preparing", "ready", "pickedUp", 
    "onTheWay", "delivered", "cancelled", "rejected"
  ];

  return (
    <div className="overflow-y-auto  h-full p-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Live Orders</h2>
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                  <th className="py-4 font-semibold w-24">Order ID</th>
                  <th className="py-4 font-semibold">Customer</th>
                  <th className="py-4 font-semibold">Items</th>
                  <th className="py-4 font-semibold">Amount</th>
                  <th className="py-4 font-semibold">Date</th>
                  <th className="py-4 font-semibold">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const totalItems = order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-mono text-xs font-bold text-gray-500">
                          #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </td>
                        <td className="py-4">
                          <div className="font-semibold text-gray-900">
                            {order.customerId?.customerId?.fullName || "Guest User"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customerId?.customerId?.phone || "No phone"}
                          </div>
                        </td>
                        <td className="py-4 font-medium text-gray-600">
                          {totalItems} items
                        </td>
                        <td className="py-4 font-bold text-orange-600">
                          ₹{order.billDetails?.finalAmount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="py-4 text-sm text-gray-500 font-medium">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <div className="text-xs opacity-70">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4">
                          <Select 
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`w-full max-w-[150px] font-semibold capitalize ${getStatusColor(order.orderStatus)}`}
                          >
                            {orderStatuses.map(status => (
                              <option key={status} value={status} className="bg-base-100 text-gray-900 capitalize">
                                {status}
                              </option>
                            ))}
                          </Select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOrders;
