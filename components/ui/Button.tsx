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
    "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-600 hover:border-indigo-500",
  secondary:
    "bg-[#1e2535] hover:bg-[#252d40] text-slate-200 border border-[#252d40] hover:border-[#2e384d]",
  ghost:
    "bg-transparent hover:bg-[#1e2535] text-slate-300 hover:text-slate-100 border border-transparent",
  danger:
    "bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-500/50",
  success:
    "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-emerald-600/30 hover:border-emerald-500/50",
  outline:
    "bg-transparent hover:bg-[#1e2535] text-slate-300 hover:text-slate-100 border border-[#252d40] hover:border-[#2e384d]",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs rounded",
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
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
