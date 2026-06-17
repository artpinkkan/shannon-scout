"use client";

import React from "react";
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
  FileText,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  phase2?: boolean;
  adminOnly?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Jobs", href: "/dashboard/jobs", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Candidates", href: "/dashboard/candidates", icon: <Users className="w-4 h-4" /> },
  { label: "Interviews", href: "/dashboard/interviews", icon: <Video className="w-4 h-4" /> },
  { label: "Transcripts", href: "/dashboard/transcripts", icon: <FileText className="w-4 h-4" /> },
  { label: "Glossary", href: "/dashboard/glossary", icon: <BookOpen className="w-4 h-4" /> },
];

const systemNavItems: NavItem[] = [
  { label: "Settings", href: "/dashboard/settings/org", icon: <Settings className="w-4 h-4" /> },
  { label: "Admin", href: "/dashboard/admin", icon: <BarChart3 className="w-4 h-4" />, adminOnly: true },
];

const phase2NavItems: NavItem[] = [
  { label: "Compliance", href: "/dashboard/compliance", icon: <Shield className="w-4 h-4" />, phase2: true },
  { label: "Fine-tuning", href: "/dashboard/fine-tuning", icon: <Zap className="w-4 h-4" />, phase2: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const navItemClass = (item: NavItem) => {
    if (isActive(item.href)) {
      return "flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 bg-[#E6F4F7] text-[#0E5E6F] border-l-2 border-[#0E5E6F] font-medium";
    }
    if (item.phase2) {
      return "flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 text-neutral-400 hover:bg-neutral-50 transition-colors";
    }
    return "flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 text-neutral-700 hover:bg-neutral-50 transition-colors";
  };

  return (
    <aside
      className="flex flex-col bg-white border-r border-neutral-200 shrink-0"
      style={{ width: "240px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-200">
        <div className="w-8 h-8 bg-[#0E5E6F] rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-900 leading-tight">Shannon Scout</p>
          <p className="text-xs text-neutral-400 leading-tight">AI Recruitment</p>
        </div>
      </div>

      {/* Tenant selector */}
      <div className="mx-3 my-2 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200 cursor-pointer hover:border-neutral-300 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#E6F4F7] flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#0E5E6F]">MT</span>
            </div>
            <span className="text-xs font-medium text-neutral-700 truncate max-w-[120px]">
              Mandiri Tech
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {/* Main nav */}
        <div className="mb-1">
          {mainNavItems.map((item) => (
            <Link key={item.href} href={item.href} className={navItemClass(item)}>
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-neutral-100" />

        {/* System nav */}
        <div className="mb-1">
          {systemNavItems.map((item) => (
            <Link key={item.href} href={item.href} className={navItemClass(item)}>
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-neutral-100" />

        {/* Phase 2 */}
        <div className="mb-1">
          <p className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Phase 2
          </p>
          {phase2NavItems.map((item) => (
            <Link key={item.href} href={item.href} className={navItemClass(item)}>
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate flex-1">{item.label}</span>
              <span className="ml-auto text-[10px] text-warning font-medium bg-warning-light px-1.5 py-0.5 rounded">
                P2
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-neutral-200">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-7 h-7 rounded-full bg-[#0E5E6F] flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {CURRENT_USER.avatarInitials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-700 truncate">
              {CURRENT_USER.name}
            </p>
            <p className="text-[10px] text-neutral-400 truncate">
              {CURRENT_USER.role}
            </p>
          </div>
          <button className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
