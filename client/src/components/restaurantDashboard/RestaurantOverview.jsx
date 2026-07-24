import { useState, useEffect } from "react";
import {
  MdOutlineRestaurantMenu,
  MdAttachMoney,
  MdOutlineShoppingBag,
  MdOutlineStarRate,
  MdAccessTime,
  MdChevronRight,
} from "react-icons/md";
import api from "../../config/ApiConfig";
import RunningLoader from "../../assets/loadingAnimation.gif";
import toast from "react-hot-toast";

const RestaurantOverview = () => {
  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await api.get("/restaurant/overview");
        if (response.data.success) {
          setPayload(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch overview", error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOverview();
  }, []);
  const getStatusColor = (status) => {
    switch (status) {
      case "Preparing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Ready":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (isLoading || !payload) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-screen bg-gray-50/50">
        <img src={RunningLoader} alt="Loading..." className="w-20 h-20" />
        <span className="text-sm text-(--color-primary) font-semibold mt-2 animate-bounce">
          Fetching Dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold text-gray-700">
            Accepting Orders
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
              <MdAttachMoney className="text-2xl" />
            </div>
            <p className="text-3xl font-black text-gray-900">
              ${payload.stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold">Total Revenue</h3>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <MdOutlineShoppingBag className="text-2xl" />
            </div>
            <p className="text-3xl font-black text-gray-900">
              {payload.stats.totalOrders}
            </p>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold">Total Orders</h3>
        </div>

        {/* Menu Items Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <MdOutlineRestaurantMenu className="text-2xl" />
            </div>
            <p className="text-3xl font-black text-gray-900">
              {payload.stats.activeMenuItems}
            </p>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold">
            Active Menu Items
          </h3>
        </div>

        {/* Rating Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <MdOutlineStarRate className="text-2xl" />
            </div>
            <p className="text-3xl font-black text-gray-900">
              {payload.stats.avgRating}{" "}
              <span className="text-lg text-gray-400 font-medium">/ 5.0</span>
            </p>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold">
            Average Rating
          </h3>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button className="text-sm font-semibold text-(--color-primary) hover:text-(--color-primary)/80 flex items-center transition-colors">
              View All <MdChevronRight className="text-lg" />
            </button>
          </div>
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-(--color-primary) [&::-webkit-scrollbar-thumb]:rounded-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm">
                  <th className="py-4 px-6 font-semibold">Order ID</th>
                  <th className="py-4 px-6 font-semibold">Customer</th>
                  <th className="py-4 px-6 font-semibold">Items</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payload.recentOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {order.id}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-700">
                      {order.customer}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {order.items} items
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel: Live Activity or Quick Actions */}
        <div className="bg-gradient-to-br from-(--color-primary) to-blue-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">Manager Control</h2>
            <p className="text-white/80 text-sm font-medium mb-8">
              Access quick tools to manage your restaurant's daily operations.
            </p>

            <div className="space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-between group">
                Manage Menu
                <MdChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-between group">
                View All Orders
                <MdChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-between group">
                Restaurant Settings
                <MdChevronRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MdAccessTime className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">
                Next Payout
              </p>
              <p className="font-bold">Today, 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOverview;
