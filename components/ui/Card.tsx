import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "bg-[#161b27] border border-[#252d40] rounded-xl",
        paddingClasses[padding],
        hover
          ? "hover:border-[#2e384d] hover:bg-[#1a2030] transition-colors cursor-pointer"
          : "",
        onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between mb-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-sm font-semibold text-slate-200 ${className}`}
    >
      {children}
    </h3>
  );
}
