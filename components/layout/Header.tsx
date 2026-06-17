"use client";

import React from "react";
import { Bell, Search, HelpCircle } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0f1117] border-b border-[#1e2535] shrink-0">
      <div>
        {title && (
          <h1 className="text-base font-semibold text-slate-100">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        <button className="p-2 text-slate-500 hover:text-slate-300 hover:bg-[#161b27] rounded-md transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
        <button className="relative p-2 text-slate-500 hover:text-slate-300 hover:bg-[#161b27] rounded-md transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center cursor-pointer">
          <span className="text-xs font-bold text-white">
            {CURRENT_USER.avatarInitials}
          </span>
        </div>
      </div>
    </header>
  );
}
