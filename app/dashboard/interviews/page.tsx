"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { INTERVIEWS } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import {
  Video,
  Clock,
  CheckCircle,
  Calendar,
  Mic,
  Plus,
  User,
  Wifi,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type Interview = (typeof INTERVIEWS)[0];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `in ${h}h ${m}m`;
  if (m > 0) return `in ${m}m`;
  return "starting soon";
}

// ── Live card ────────────────────────────────────────────────────────────────

function LiveCard({ iv }: { iv: Interview }) {
  return (
    <div className="bg-white border border-red-200 rounded-xl p-4 hover:border-red-300 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">
            {iv.candidateName}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{iv.jobTitle}</p>
        </div>
        <span className="flex items-center gap-1.5 bg-red-50 text-red-600 text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{iv.interviewerName} · {iv.interviewerRole}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{iv.durationMinutes} min · {iv.asrProvider}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Wifi className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
          <span className="text-emerald-600 font-medium">Connected · {iv.language === "mixed" ? "ID/EN" : "ID"}</span>
        </div>
      </div>

      <Link href={`/dashboard/interviews/${iv.id}`} className="block">
        <Button variant="danger" size="sm" fullWidth leftIcon={<Video className="w-4 h-4" />}>
          Join Room
        </Button>
      </Link>
    </div>
  );
}

// ── Upcoming card ────────────────────────────────────────────────────────────

function UpcomingCard({ iv }: { iv: Interview }) {
  const until = timeUntil(iv.scheduledAt);
  const isSoon = new Date(iv.scheduledAt).getTime() - Date.now() < 3_600_000;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-[#0E5E6F]/40 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">
            {iv.candidateName}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{iv.jobTitle}</p>
        </div>
        <span
          className={[
            "text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 border",
            isSoon
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-[#E6F4F7] text-[#0E5E6F] border-[#0E5E6F]/20",
          ].join(" ")}
        >
          {until}
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{iv.interviewerName}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{formatDate(iv.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>{iv.durationMinutes} min · {iv.asrProvider}</span>
        </div>
      </div>

      <Link href={`/dashboard/interviews/${iv.id}`} className="block">
        <Button variant="secondary" size="sm" fullWidth leftIcon={<Video className="w-4 h-4" />}>
          Open Room
        </Button>
      </Link>
    </div>
  );
}

// ── Completed card ───────────────────────────────────────────────────────────

function CompletedCard({ iv }: { iv: Interview }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 hover:bg-neutral-50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-neutral-700 truncate">
            {iv.candidateName}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{iv.jobTitle}</p>
        </div>
        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        <span className="text-xs text-neutral-400">{iv.interviewerName}</span>
        <span className="text-xs text-neutral-300">·</span>
        <span className="text-xs text-neutral-400">{formatDateShort(iv.scheduledAt)}</span>
        <span className="text-xs text-neutral-300">·</span>
        <span className="text-xs text-neutral-400">{iv.durationMinutes} min</span>
        {iv.wer !== undefined && (
          <>
            <span className="text-xs text-neutral-300">·</span>
            <span className="text-xs text-emerald-600 font-medium">WER {iv.wer}%</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {iv.transcriptReady && (
          <Link href={`/dashboard/interviews/${iv.id}/review`} className="flex-1">
            <Button variant="ghost" size="xs" fullWidth leftIcon={<Mic className="w-3.5 h-3.5" />}>
              AI Review
            </Button>
          </Link>
        )}
        <Link href={`/dashboard/transcripts`} className={iv.transcriptReady ? "" : "flex-1"}>
          <Button variant="secondary" size="xs" fullWidth leftIcon={<FileText className="w-3.5 h-3.5" />}>
            Transcript
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ── Column wrapper ───────────────────────────────────────────────────────────

interface ColumnProps {
  title: string;
  count: number;
  accent: "red" | "teal" | "neutral";
  icon: React.ReactNode;
  children: React.ReactNode;
  emptyMessage: string;
}

function Column({ title, count, accent, icon, children, emptyMessage }: ColumnProps) {
  const headerClass = {
    red: "bg-red-50 border-red-200 text-red-700",
    teal: "bg-[#E6F4F7] border-[#0E5E6F]/20 text-[#0E5E6F]",
    neutral: "bg-neutral-50 border-neutral-200 text-neutral-600",
  }[accent];

  const countClass = {
    red: "bg-red-100 text-red-700",
    teal: "bg-[#0E5E6F]/10 text-[#0E5E6F]",
    neutral: "bg-neutral-200 text-neutral-600",
  }[accent];

  return (
    <div className="flex flex-col min-w-0">
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-xl border ${headerClass} mb-0`}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${countClass}`}>
          {count}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto border-x border-b border-neutral-200 rounded-b-xl p-3 space-y-3 bg-neutral-50 min-h-[200px]">
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-8 h-8 text-neutral-200 mb-2" />
            <p className="text-xs text-neutral-400">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function InterviewsPage() {
  const liveInterviews = INTERVIEWS.filter((i) => i.status === "live");
  const upcomingInterviews = [...INTERVIEWS]
    .filter((i) => i.status === "scheduled")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const pastInterviews = [...INTERVIEWS]
    .filter((i) => ["completed", "cancelled"].includes(i.status))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Interviews" subtitle="Schedule, join, and review interview sessions" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Page title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">Interviews</h1>
            <p className="mt-0.5 text-sm text-neutral-400">
              {liveInterviews.length} live · {upcomingInterviews.length} upcoming · {pastInterviews.length} completed
            </p>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Schedule Interview
          </Button>
        </div>

        {/* 3-column kanban */}
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-220px)]">

          {/* Live Now */}
          <Column
            title="Live Now"
            count={liveInterviews.length}
            accent="red"
            icon={<span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            emptyMessage="No active sessions right now"
          >
            {liveInterviews.map((iv) => (
              <LiveCard key={iv.id} iv={iv} />
            ))}
          </Column>

          {/* Upcoming */}
          <Column
            title="Upcoming"
            count={upcomingInterviews.length}
            accent="teal"
            icon={<Calendar className="w-3.5 h-3.5" />}
            emptyMessage="No scheduled interviews"
          >
            {upcomingInterviews.map((iv) => (
              <UpcomingCard key={iv.id} iv={iv} />
            ))}
          </Column>

          {/* Completed */}
          <Column
            title="Completed"
            count={pastInterviews.length}
            accent="neutral"
            icon={<CheckCircle className="w-3.5 h-3.5" />}
            emptyMessage="No completed interviews yet"
          >
            {pastInterviews.map((iv) => (
              <CompletedCard key={iv.id} iv={iv} />
            ))}
          </Column>

        </div>
      </div>
    </div>
  );
}
