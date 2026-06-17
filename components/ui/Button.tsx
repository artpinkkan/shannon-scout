"use client";

import React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "outline";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0E5E6F] text-white hover:bg-[#09414D] border border-[#0E5E6F] hover:border-[#09414D]",
  secondary:
    "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50",
  ghost:
    "bg-transparent hover:bg-[#E6F4F7] text-[#0E5E6F] border border-transparent",
  danger:
    "bg-[#C0392B] text-white hover:bg-[#a93226] border border-[#C0392B]",
  success:
    "bg-[#1A7F4B] text-white hover:bg-[#156b3f] border border-[#1A7F4B]",
  outline:
    "bg-transparent hover:bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs rounded",
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "h-9 px-4 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-base rounded-lg",
};

export default function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !loading && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
