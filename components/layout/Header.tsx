"use client";

import React, { useState } from "react";
import { Bell, HelpCircle, X, BookOpen, MessageSquare, ExternalLink, CheckCircle } from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const NOTIFICATIONS = [
  {
    id: "n1",
    type: "interview",
    title: "Interview completed",
    body: "Rizky Pratama — Senior PM · AI review ready",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "ranking",
    title: "Rankings generated",
    body: "Senior Product Manager · 8 candidates ranked",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n3",
    type: "stage",
    title: "Stage updated",
    body: "Siti Nurhaliza moved to Decision",
    time: "3 hr ago",
    read: true,
  },
  {
    id: "n4",
    type: "doc",
    title: "Document sent",
    body: "PKS sent to Ahmad Fauzi — awaiting signature",
    time: "Yesterday",
    read: true,
  },
];

const HELP_ITEMS = [
  { icon: <BookOpen className="w-4 h-4 text-[#0E5E6F]" />, label: "Documentation", desc: "Guides and API reference" },
  { icon: <MessageSquare className="w-4 h-4 text-[#1A7F4B]" />, label: "Live Support", desc: "Chat with our team" },
  { icon: <ExternalLink className="w-4 h-4 text-neutral-500" />, label: "Release Notes", desc: "What's new in Shannon" },
];

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-neutral-200 shrink-0 relative z-20">
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

        {/* Help */}
        <div className="relative">
          <button
            onClick={() => { setHelpOpen((v) => !v); setNotifOpen(false); }}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {helpOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setHelpOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-xs font-semibold text-neutral-700">Help & Resources</p>
                </div>
                <div className="p-2">
                  {HELP_ITEMS.map((item) => (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                    >
                      {item.icon}
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{item.label}</p>
                        <p className="text-[10px] text-neutral-400">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setHelpOpen(false); }}
            className="relative p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#0E5E6F] rounded-full" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-80 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-neutral-700">Notifications</p>
                    {unread > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#E6F4F7] text-[#0E5E6F] rounded-full font-bold">
                        {unread} new
                      </span>
                    )}
                  </div>
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-[#0E5E6F] hover:underline flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => setNotifications((prev) =>
                        prev.map((x) => x.id === n.id ? { ...x, read: true } : x)
                      )}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50 transition-colors ${!n.read ? "bg-[#F7FBFC]" : ""}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-[#0E5E6F]" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-800">{n.title}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{n.body}</p>
                        <p className="text-[10px] text-neutral-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {notifications.every((n) => n.read) && (
                  <div className="py-6 text-center">
                    <p className="text-xs text-neutral-400">All caught up!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="w-7 h-7 rounded-full bg-[#0E5E6F] flex items-center justify-center cursor-pointer">
          <span className="text-xs font-bold text-white">
            {CURRENT_USER.avatarInitials}
          </span>
        </div>
      </div>
    </header>
  );
}
