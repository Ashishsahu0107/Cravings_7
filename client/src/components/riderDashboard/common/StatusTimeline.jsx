import React from "react";
import { MdCheck } from "react-icons/md";

const StatusTimeline = ({ currentStatus, steps }) => {
  const currentIndex = steps.findIndex(s => s.value === currentStatus);

  return (
    <div className="py-4">
      <div className="relative flex justify-between">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-base-300 -translate-y-1/2 rounded-full z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500"
          style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.value} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCompleted 
                    ? "bg-primary border-primary text-primary-content" 
                    : "bg-base-100 border-base-300 text-base-content/30"
                } ${isCurrent ? "ring-4 ring-primary/30" : ""}`}
              >
                {isCompleted ? <MdCheck className="text-lg" /> : <span className="text-xs">{index + 1}</span>}
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block absolute top-full w-24 text-center ${
                isCurrent ? "text-primary font-bold" : "text-base-content/60"
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-8 text-center sm:hidden font-semibold text-primary">
        {currentIndex >= 0 ? steps[currentIndex].label : "Waiting..."}
      </div>
    </div>
  );
};

export default StatusTimeline;
