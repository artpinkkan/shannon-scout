"use client";

import React from "react";
import { Bell, HelpCircle } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-neutral-200 shrink-0">
      <div>
        {title && (
          <h1 className="text-base font-semibold text-neutral-900">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        <button className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
        <button className="relative p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0E5E6F] rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-[#0E5E6F] flex items-center justify-center cursor-pointer">
          <span className="text-xs font-bold text-white">
            {CURRENT_USER.avatarInitials}
          </span>
        </div>
      </div>
    </header>
  );
}
