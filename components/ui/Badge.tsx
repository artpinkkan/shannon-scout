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
  default: "bg-[#ECEEF0] text-[#8D969E] border border-neutral-200",
  primary: "bg-[#E6F4F7] text-[#09414D] border border-[#E6F4F7]",
  success: "bg-[#E8F5EE] text-[#1A7F4B] border border-[#E8F5EE]",
  warning: "bg-[#FEF3E2] text-[#B45309] border border-[#FEF3E2]",
  danger: "bg-[#FDECEA] text-[#C0392B] border border-[#FDECEA]",
  info: "bg-[#E6F4F7] text-[#0E5E6F] border border-[#E6F4F7]",
  purple: "bg-[#EEF2FF] text-[#4338CA] border border-[#EEF2FF]",
  neutral: "bg-[#ECEEF0] text-[#8D969E] border border-neutral-200",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-neutral-400",
  primary: "bg-[#0E5E6F]",
  success: "bg-[#1A7F4B]",
  warning: "bg-[#B45309]",
  danger: "bg-[#C0392B]",
  info: "bg-[#0E5E6F]",
  purple: "bg-[#4338CA]",
  neutral: "bg-neutral-400",
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
