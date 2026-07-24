import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RiderSidebar from "../../components/riderDashboard/RiderSidebar";
import RiderOverview from "../../components/riderDashboard/RiderOverview";
import RiderOrders from "../../components/riderDashboard/RiderOrders";
import RiderSetting from "../../components/riderDashboard/RiderSetting";

const RiderDashboard = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = React.useState(active || "overview");
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  if (!isLogin || role !== "rider") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')]  bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center ">
          <h1 className="text-2xl font-bold text-neutral-content">
            Access Denied. Please log in as a Rider to view this page.
          </h1>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-[91vh] flex gap-2 p-2">
        <div
          className={`transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} bg-base-200 p-4 rounded-lg shadow-md h-full`}
        >
          <RiderSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>
        <div className="flex-1 transition-all duration-300 bg-base-100 p-4 rounded-lg shadow-md h-full overflow-hidden">
          {activeTab === "overview" && <RiderOverview />}
          {activeTab === "orders" && <RiderOrders />}
          {activeTab === "settings" && <RiderSetting />}
        </div>
      </div>
    </>
  );
};

export default RiderDashboard;
