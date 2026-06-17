"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Video,
  BookOpen,
  Settings,
  Shield,
  BarChart3,
  ChevronDown,
  Zap,
  LogOut,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  phase2?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Recruitment",
    items: [
      {
        label: "Jobs",
        href: "/dashboard/jobs",
        icon: <Briefcase className="w-4 h-4" />,
      },
      {
        label: "Candidates",
        href: "/dashboard/candidates",
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: "Interviews",
        href: "/dashboard/interviews",
        icon: <Video className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "AI & Language",
    items: [
      {
        label: "NLP Settings",
        href: "/dashboard/nlp-settings",
        icon: <Settings className="w-4 h-4" />,
      },
      {
        label: "Domain Glossary",
        href: "/dashboard/glossary",
        icon: <BookOpen className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        label: "Admin Dashboard",
        href: "/dashboard/admin",
        icon: <BarChart3 className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "Phase 2",
    items: [
      {
        label: "Compliance",
        href: "/dashboard/compliance",
        icon: <Shield className="w-4 h-4" />,
        phase2: true,
      },
      {
        label: "Fine-tuning",
        href: "/dashboard/fine-tuning",
        icon: <Zap className="w-4 h-4" />,
        phase2: true,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={[
        "flex flex-col bg-[#0f1117] border-r border-[#1e2535] transition-all duration-300 shrink-0",
        collapsed ? "w-[60px]" : "w-[220px]",
      ].join(" ")}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1e2535]">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-slate-100 leading-tight">
              Shannon Scout
            </p>
            <p className="text-xs text-slate-500 leading-tight">AI Recruitment</p>
          </div>
        )}
      </div>

      {/* Tenant selector */}
      {!collapsed && (
        <div className="mx-3 my-2 px-3 py-2 bg-[#161b27] rounded-lg border border-[#252d40] cursor-pointer hover:border-[#2e384d] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-400">MT</span>
              </div>
              <span className="text-xs font-medium text-slate-300 truncate max-w-[100px]">
                Mandiri Tech
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed && (
              <p className="px-2 py-1 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors mb-0.5",
                  isActive(item.href)
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30"
                    : item.phase2
                    ? "text-slate-600 hover:text-slate-500 hover:bg-[#161b27]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#161b27]",
                  collapsed ? "justify-center" : "",
                ].join(" ")}
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!collapsed && item.phase2 && (
                  <span className="ml-auto text-[10px] text-amber-600 font-medium bg-amber-600/10 px-1.5 py-0.5 rounded">
                    P2
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-[10px] bg-indigo-600/30 text-indigo-300 px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User & collapse */}
      <div className="border-t border-[#1e2535]">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {CURRENT_USER.avatarInitials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">
                {CURRENT_USER.name}
              </p>
              <p className="text-[10px] text-slate-600 truncate">
                {CURRENT_USER.role}
              </p>
            </div>
            <button className="text-slate-600 hover:text-slate-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center py-2 text-slate-600 hover:text-slate-400 hover:bg-[#161b27] transition-colors text-xs"
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>
    </aside>
  );
}
