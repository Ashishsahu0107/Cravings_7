import React from "react";
import { MdErrorOutline, MdRefresh } from "react-icons/md";

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
      <MdErrorOutline className="text-5xl text-error mb-4" />
      <h3 className="text-lg font-bold mb-2">Something went wrong</h3>
      <p className="text-neutral mb-6 max-w-sm">{message || "We encountered an unexpected error."}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 bg-base-200 text-base-content px-6 py-2 rounded-lg font-semibold hover:bg-base-300 transition-colors"
        >
          <MdRefresh className="text-xl" /> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
