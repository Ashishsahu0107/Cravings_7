import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const KPICard = ({ title, value, icon, trend, data }) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-neutral text-sm font-semibold mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${isPositive ? "text-success" : "text-error"}`}>
              {isPositive ? "↑" : "↓"} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      {data && (
        <div className="absolute bottom-0 left-0 w-full h-12 opacity-30 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? "#10b981" : "#ef4444"} 
                fill={isPositive ? "#10b981" : "#ef4444"} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default KPICard;
