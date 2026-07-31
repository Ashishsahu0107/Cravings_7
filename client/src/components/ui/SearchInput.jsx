import React from "react";
import { MdSearch, MdClose } from "react-icons/md";

const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${containerClassName}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <MdSearch size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-9 py-2 bg-primary-content border border-secondary rounded-lg text-sm placeholder-gray-400 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
          title="Clear search"
        >
          <MdClose size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
