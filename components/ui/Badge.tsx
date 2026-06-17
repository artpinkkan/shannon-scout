import React from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#1e2535] text-slate-300 border border-[#252d40]",
  primary: "bg-indigo-600/20 text-indigo-300 border border-indigo-600/30",
  success: "bg-emerald-600/20 text-emerald-300 border border-emerald-600/30",
  warning: "bg-amber-600/20 text-amber-300 border border-amber-600/30",
  danger: "bg-red-600/20 text-red-300 border border-red-600/30",
  info: "bg-sky-600/20 text-sky-300 border border-sky-600/30",
  purple: "bg-purple-600/20 text-purple-300 border border-purple-600/30",
  neutral: "bg-slate-700/30 text-slate-400 border border-slate-700/50",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-slate-400",
  primary: "bg-indigo-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-sky-400",
  purple: "bg-purple-400",
  neutral: "bg-slate-500",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
