import React from "react";

const EmptyState = ({ title, description, icon, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[400px]">
      <div className="text-6xl text-base-300 mb-4">{icon || "📭"}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-neutral mb-6 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="bg-primary text-primary-content px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
