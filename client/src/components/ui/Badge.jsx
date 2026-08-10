import React from "react";

const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200";

  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-[10px]",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const variantStyles = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    neutral: "bg-base-200 text-base-content border border-base-300",
    success: "bg-success/15 text-success border border-success/20",
    warning: "bg-warning/15 text-warning border border-warning/20",
    error: "bg-error/15 text-error border border-error/20",
    info: "bg-info/10 text-info border border-info/20",
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
