"use client";

import React from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabsProps) {
  return (
    <div
      className={`flex items-center gap-1 border-b border-neutral-200 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={[
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
            activeTab === tab.id
              ? "border-[#0E5E6F] text-[#0E5E6F]"
              : "border-transparent text-neutral-400 hover:text-neutral-700 hover:border-neutral-300",
          ].join(" ")}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={[
                "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs rounded-full",
                activeTab === tab.id
                  ? "bg-[#E6F4F7] text-[#0E5E6F]"
                  : "bg-neutral-100 text-neutral-400",
              ].join(" ")}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
