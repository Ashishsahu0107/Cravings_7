import React from "react";

const LoadingSkeleton = ({ rows = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-base-200 h-24 rounded-xl w-full"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
