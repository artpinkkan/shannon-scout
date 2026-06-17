"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import { CANDIDATES } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Search, Star, MapPin, Briefcase, Filter, Users } from "lucide-react";
import Link from "next/link";
import type { PipelineStage } from "@/lib/types";

const stageVariant: Record<PipelineStage, "neutral" | "info" | "warning" | "success" | "danger"> = {
  screening: "neutral",
  interview: "info",
  decision: "warning",
  hired: "success",
  rejected: "danger",
};

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const filtered = CANDIDATES.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.currentRole.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "all" || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const stageCounts: Record<string, number> = {
    all: CANDIDATES.length,
    screening: CANDIDATES.filter((c) => c.stage === "screening").length,
    interview: CANDIDATES.filter((c) => c.stage === "interview").length,
    decision: CANDIDATES.filter((c) => c.stage === "decision").length,
    hired: CANDIDATES.filter((c) => c.stage === "hired").length,
    rejected: CANDIDATES.filter((c) => c.stage === "rejected").length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Candidates" subtitle="All candidate profiles across open positions" />

      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Candidates"
          description={`${CANDIDATES.length} total candidates`}
          actions={
            <Button variant="secondary" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
              Filters
            </Button>
          }
        />

        {/* Stage filter tabs */}
        <div className="flex items-center gap-3 mb-5">
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            fullWidth={false}
            className="w-64"
          />
          <div className="flex items-center gap-1 p-1 bg-neutral-50 border border-neutral-200 rounded-lg">
            {(["all", "screening", "interview", "decision", "hired", "rejected"] as const).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setStageFilter(s)}
                  className={[
                    "px-2.5 py-1.5 text-xs font-medium rounded transition-colors capitalize",
                    stageFilter === s
                      ? "bg-[#0E5E6F] text-white"
                      : "text-neutral-400 hover:text-neutral-700",
                  ].join(" ")}
                >
                  {s}
                  <span className="ml-1 opacity-70">{stageCounts[s]}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Candidate</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Current Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Applied For</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Location</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Score</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Applied</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                    idx === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ backgroundColor: c.avatarColor }}
                      >
                        {c.avatarInitials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">{c.name}</p>
                        <p className="text-xs text-neutral-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">
                    {c.currentRole} @ {c.currentCompany}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400 max-w-[160px]">
                    <span className="truncate block">{c.jobTitle}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      {c.location}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={stageVariant[c.stage]} size="sm" dot>
                      {c.stage.charAt(0).toUpperCase() + c.stage.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-neutral-700">{c.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">
                    {new Date(c.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/candidates/${c.id}`}>
                      <Button variant="ghost" size="xs">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-neutral-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No candidates found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
