import React from "react";
import { 
  MdDashboard, MdMenu, MdChevronLeft, MdShoppingCart, MdMoped, 
  MdHistory, MdAttachMoney, MdAccountBalanceWallet, MdCardGiftcard, 
  MdTrendingUp, MdNotifications, MdMessage, MdDescription, 
  MdDirectionsBike, MdPerson, MdSupportAgent, MdSecurity, MdSettings 
} from "react-icons/md";
import OnlineStatusToggle from "./common/OnlineStatusToggle";

const RiderSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) => {
  const mainTabs = [
    { name: "Overview", value: "overview", icon: <MdDashboard /> },
    { name: "Available Orders", value: "orders", icon: <MdShoppingCart /> },
    { name: "Current Delivery", value: "delivery", icon: <MdMoped /> },
    { name: "Delivery History", value: "history", icon: <MdHistory /> },
    { name: "Earnings", value: "earnings", icon: <MdAttachMoney /> },
    { name: "Wallet", value: "wallet", icon: <MdAccountBalanceWallet /> },
  ];

  const secondaryTabs = [
    { name: "Incentives", value: "incentives", icon: <MdCardGiftcard /> },
    { name: "Performance", value: "performance", icon: <MdTrendingUp /> },
    { name: "Notifications", value: "notifications", icon: <MdNotifications /> },
    { name: "Messages", value: "messages", icon: <MdMessage /> },
    { name: "Documents", value: "documents", icon: <MdDescription /> },
    { name: "Vehicle", value: "vehicle", icon: <MdDirectionsBike /> },
    { name: "Profile", value: "profile", icon: <MdPerson /> },
    { name: "Support", value: "support", icon: <MdSupportAgent /> },
    { name: "Safety", value: "safety", icon: <MdSecurity /> },
  ];

  const settingsTab = {
    name: "Settings",
    value: "settings",
    icon: <MdSettings />,
  };

  const renderTab = (tab) => (
    <li
      key={tab.value}
      className={`cursor-pointer p-2 rounded-lg text-neutral flex items-center gap-3 ${
        activeTab === tab.value
          ? "bg-primary text-primary-content font-semibold shadow-sm"
          : "hover:bg-primary/10 hover:text-primary transition-colors duration-200"
      } ${isCollapsed ? "justify-center" : ""}`}
      onClick={() => setActiveTab(tab.value)}
      title={isCollapsed ? tab.name : ""}
    >
      <div className="text-xl">{tab.icon}</div>
      {!isCollapsed && <span className="text-sm">{tab.name}</span>}
    </li>
  );

  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} mb-6`}>
        {!isCollapsed && <span className="font-bold text-xl ml-2">Rider App</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-base-300 rounded-md transition-colors"
        >
          {isCollapsed ? <MdMenu className="text-2xl" /> : <MdChevronLeft className="text-2xl" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-base-300">
        <ul className="space-y-1">
          {mainTabs.map(renderTab)}
        </ul>
        
        {!isCollapsed && <div className="text-xs font-bold text-neutral/50 uppercase ml-2 mb-2">Account</div>}
        <ul className="space-y-1">
          {secondaryTabs.map(renderTab)}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-base-200">
        <ul className="space-y-1 mb-4">
          {renderTab(settingsTab)}
        </ul>
        <OnlineStatusToggle isCompact={isCollapsed} />
      </div>
    </div>
  );
};

export default RiderSidebar;
