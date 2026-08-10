import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoChevronDown } from "react-icons/io5";

const Select = ({
  children,
  value,
  onChange,
  name,
  className = "",
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Parse <option> children to extract values and labels
  const options = [];
  let selectedLabel = "Select an option";

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === "option") {
      const optionValue = child.props.value;
      const optionLabel = child.props.children;
      const isDisabled = child.props.disabled;

      options.push({
        value: optionValue,
        label: optionLabel,
        disabled: isDisabled,
      });

      // If this option is currently selected, use its label for the main button
      if (
        value !== undefined && 
        value !== null && 
        String(value) === String(optionValue)
      ) {
        selectedLabel = optionLabel;
      } else if (
        (value === undefined || value === null || value === "") && 
        optionValue === ""
      ) {
        // Fallback for default placeholder option
        selectedLabel = optionLabel;
      }
    }
  });

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (onChange) {
      // Create a synthetic event object that mimics the native onChange event
      const event = {
        target: {
          name,
          value: optionValue,
        },
      };
      onChange(event);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block w-full text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all 
          ${
            disabled
              ? "bg-base-200 text-base-content/50 cursor-not-allowed border-base-200"
              : "bg-transparent text-base-content border-gray-300 hover:border-primary cursor-pointer"
          }`}
      >
        <span className="truncate">{selectedLabel}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IoChevronDown className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-1.5 w-full rounded-xl bg-base-100 shadow-xl border border-base-200 focus:outline-none max-h-60 overflow-y-auto scrollbar-none"
          >
            <div className="py-1" role="listbox">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!option.disabled) handleSelect(option.value);
                  }}
                  disabled={option.disabled}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                    ${
                      option.disabled
                        ? "text-gray-400 cursor-not-allowed opacity-50"
                        : "text-base-content hover:bg-base-200 cursor-pointer"
                    }
                    ${String(value) === String(option.value) ? "bg-primary/10 text-primary font-medium" : ""}
                  `}
                  role="option"
                  aria-selected={String(value) === String(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
