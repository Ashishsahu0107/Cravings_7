import React from "react";
import { MdDashboard, MdMenu, MdChevronLeft } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

const RiderSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
}) => {
  const mainTabs = [
    { name: "Overview", value: "overview", icon: <MdDashboard /> },
    { name: "Orders", value: "orders", icon: <FaShoppingCart /> },
  ];

  const settingsTab = {
    name: "Settings",
    value: "settings",
    icon: <IoMdSettings />,
  };

  const renderTab = (tab) => (
    <li
      key={tab.value}
      className={`cursor-pointer p-2 rounded text-neutral flex items-center gap-3 ${
        activeTab === tab.value
          ? "bg-primary text-primary-content font-semibold"
          : "hover:bg-secondary hover:text-secondary-content transition-colors duration-200"
      } ${isCollapsed ? "justify-center" : ""}`}
      onClick={() => setActiveTab(tab.value)}
      title={isCollapsed ? tab.name : ""}
    >
      <div className="text-xl">{tab.icon}</div>
      {!isCollapsed && <span>{tab.name}</span>}
    </li>
  );

  return (
    <>
      <div className="h-full flex flex-col">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} mb-6`}
        >
          {!isCollapsed && <span className="font-bold text-xl ml-2">Menu</span>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-base-300 rounded-md transition-colors"
          >
            {isCollapsed ? (
              <MdMenu className="text-2xl" />
            ) : (
              <MdChevronLeft className="text-2xl" />
            )}
          </button>
        </div>
        <ul className="space-y-4 flex-1">
          {mainTabs.map((tab) => renderTab(tab))}
        </ul>
        <ul className="space-y-4 border-t border-secondary py-2">
          {renderTab(settingsTab)}
        </ul>
      </div>
    </>
  );
};

export default RiderSidebar;
