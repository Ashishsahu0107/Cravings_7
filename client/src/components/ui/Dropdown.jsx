import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Dropdown = ({
  trigger,
  children,
  align = "right",
  className = "",
  width = "w-48",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine alignment classes
  const alignmentClasses =
    align === "left"
      ? "left-0"
      : align === "right"
      ? "right-0"
      : "left-1/2 -translate-x-1/2";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer select-none">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-99 mt-2 ${width} rounded-xl bg-base-100 shadow-xl border border-base-200 focus:outline-none max-h-60 overflow-y-auto scrollbar-none ${alignmentClasses} ${className}`}
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    onClick: (e) => {
                      if (child.props.onClick) child.props.onClick(e);
                      if (!child.props.keepOpen) setIsOpen(false);
                    },
                  });
                }
                return child;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({
  children,
  onClick,
  icon,
  className = "",
  danger = false,
  keepOpen = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors duration-200 
        ${
          danger
            ? "text-error hover:bg-error/10"
            : "text-base-content hover:bg-base-200"
        }
        ${className}`}
      role="menuitem"
    >
      {icon && <span className="text-lg shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className="h-[1px] my-1 bg-base-200 w-full" />;
};
