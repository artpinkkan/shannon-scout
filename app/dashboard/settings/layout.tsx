"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { label: "Org Settings", href: "/dashboard/settings/org" },
  { label: "Compliance", href: "/dashboard/settings/compliance" },
  { label: "Users", href: "/dashboard/settings/users" },
  { label: "Billing", href: "/dashboard/settings/billing" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full overflow-hidden">
      {/* Settings mini-nav */}
      <div className="w-48 border-r border-neutral-200 bg-neutral-50 shrink-0 p-3">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1 mb-2">Settings</p>
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center px-2 py-2 rounded-md text-sm mb-0.5 transition-colors",
              pathname === item.href
                ? "bg-[#E6F4F7] text-[#0E5E6F] font-medium"
                : "text-neutral-700 hover:bg-white",
            ].join(" ")}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
