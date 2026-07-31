import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  leftIcon = null,
  rightIcon = null,
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-primary text-primary-content hover:bg-primary/90 focus:ring-primary shadow-sm",
    secondary:
      "bg-secondary text-secondary-content hover:bg-secondary/90 focus:ring-secondary shadow-sm",
    outline:
      "border border-secondary bg-transparent hover:bg-base-200 text-base-content focus:ring-secondary",
    ghost:
      "bg-transparent hover:bg-base-200 text-base-content focus:ring-base-300",
    danger:
      "bg-error text-error-content hover:bg-error/90 focus:ring-error shadow-sm",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && leftIcon && (
        <span className="flex items-center shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="flex items-center shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
