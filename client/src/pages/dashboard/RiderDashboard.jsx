import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RiderProvider } from "../../context/RiderContext";
import RiderSidebar from "../../components/riderDashboard/RiderSidebar";
import RiderOverview from "../../components/riderDashboard/RiderOverview";
// import AvailableOrders from "../../components/riderDashboard/AvailableOrders";
// import CurrentDelivery from "../../components/riderDashboard/CurrentDelivery";
// import DeliveryHistory from "../../components/riderDashboard/DeliveryHistory";
// import Earnings from "../../components/riderDashboard/Earnings";
// import Wallet from "../../components/riderDashboard/Wallet";
// import Incentives from "../../components/riderDashboard/Incentives";
// import Performance from "../../components/riderDashboard/Performance";
// import Notifications from "../../components/riderDashboard/Notifications";
// import Messages from "../../components/riderDashboard/Messages";
// import Documents from "../../components/riderDashboard/Documents";
// import Vehicle from "../../components/riderDashboard/Vehicle";
import RiderSetting from "../../components/riderDashboard/RiderSetting";
// import Support from "../../components/riderDashboard/Support";
// import Safety from "../../components/riderDashboard/Safety";
// import Settings from "../../components/riderDashboard/Settings";

import { 
  MdDashboard, MdShoppingCart, MdMoped, MdAttachMoney, MdPerson 
} from "react-icons/md";
import OnlineStatusToggle from "../../components/riderDashboard/common/OnlineStatusToggle";

const RiderDashboardContent = () => {
  const { isLogin, role } = useAuth();
  const navigate = useNavigate();
  const active = useLocation().state?.activeTab;
  const [activeTab, setActiveTab] = useState(active || "overview");
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isLogin || role !== "rider") {
    return (
      <div className="h-[92vh] bg-[url('/foodTable.webp')] bg-cover bg-center">
        <div className="h-full backdrop-blur-lg flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-neutral-content text-center px-4">
            Access Denied. Please log in as a Rider.
          </h1>
          <button
            className="mt-6 px-6 py-2 bg-primary text-primary-content rounded-lg font-semibold"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview": return <RiderOverview />;
      // case "orders": return <AvailableOrders />;
      // case "delivery": return <CurrentDelivery />;
      // case "history": return <DeliveryHistory />;
      // case "earnings": return <Earnings />;
      // case "wallet": return <Wallet />;
      // case "incentives": return <Incentives />;
      // case "performance": return <Performance />;
      // case "notifications": return <Notifications />;
      // case "messages": return <Messages />;
      // case "documents": return <Documents />;
      // case "vehicle": return <Vehicle />;
      case "profile": return <RiderSetting />; // We reuse existing setting for profile
      // case "support": return <Support />;
      // case "safety": return <Safety />;
      // case "settings": return <Settings />;
      default: return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-bold mb-2">Under Construction</h2>
            <p className="text-neutral">This section is coming soon.</p>
          </div>
        </div>
      );
    }
  };

  const mobileTabs = [
    { name: "Home", value: "overview", icon: <MdDashboard /> },
    { name: "Orders", value: "orders", icon: <MdShoppingCart /> },
    { name: "Delivery", value: "delivery", icon: <MdMoped /> },
    { name: "Earnings", value: "earnings", icon: <MdAttachMoney /> },
    { name: "Profile", value: "profile", icon: <MdPerson /> },
  ];

  return (
    <div className="h-[91vh] flex flex-col md:flex-row gap-2 p-2 relative bg-base-300/30">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } bg-base-100 p-4 rounded-2xl shadow-sm border border-base-200 h-full`}
      >
        <RiderSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-base-100 rounded-2xl shadow-sm border border-base-200 h-full overflow-hidden relative">
        {/* Top Navbar for Mobile/Tablet */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-base-200">
          <h1 className="font-bold text-lg capitalize">{activeTab.replace('-', ' ')}</h1>
          <div className="w-32">
            <OnlineStatusToggle isCompact={false} />
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden pb-16 md:pb-0">
          {renderTabContent()}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 flex justify-around p-2 z-50">
          {mobileTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex flex-col items-center justify-center w-16 p-2 rounded-xl transition-colors ${
                activeTab === tab.value ? "text-primary" : "text-neutral"
              }`}
            >
              <div className="text-2xl mb-1">{tab.icon}</div>
              <span className="text-[10px] font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const RiderDashboard = () => {
  return (
    <RiderProvider>
      <RiderDashboardContent />
    </RiderProvider>
  );
};

export default RiderDashboard;
