"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Shield,
  Download,
  Sparkles,
  ChevronRight,
  FileSignature,
  Stethoscope,
  PenLine,
} from "lucide-react";
import { getAuditEntriesByJobId, getCandidateById, getJobById } from "@/lib/mock-data";
import { getStoredAuditEntriesByJobId } from "@/lib/audit-store";
import type { AuditEntityType, AuditEntry } from "@/lib/types";
import Button from "./Button";

const AUDIT_ICON: Record<AuditEntityType, React.ReactNode> = {
  ranking_generated: <Sparkles className="w-3.5 h-3.5 text-[#0E5E6F]" />,
  stage_advanced: <ChevronRight className="w-3.5 h-3.5 text-[#1A7F4B]" />,
  document_sent: <FileSignature className="w-3.5 h-3.5 text-indigo-500" />,
  medical_requested: <Stethoscope className="w-3.5 h-3.5 text-amber-500" />,
  custom_action: <PenLine className="w-3.5 h-3.5 text-neutral-500" />,
};

const AUDIT_BG: Record<AuditEntityType, string> = {
  ranking_generated: "bg-[#E6F4F7]",
  stage_advanced: "bg-[#E8F5EE]",
  document_sent: "bg-indigo-50",
  medical_requested: "bg-amber-50",
  custom_action: "bg-neutral-100",
};

const AUDIT_TEXT: Record<AuditEntityType, string> = {
  ranking_generated: "text-[#0E5E6F]",
  stage_advanced: "text-[#1A7F4B]",
  document_sent: "text-indigo-600",
  medical_requested: "text-amber-600",
  custom_action: "text-neutral-600",
};

const AUDIT_LABEL: Record<AuditEntityType, string> = {
  ranking_generated: "AI Ranking",
  stage_advanced: "Stage Move",
  document_sent: "Document",
  medical_requested: "Medical",
  custom_action: "Custom",
};

function formatAuditTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AuditTrailDrawer({ jobId, isOpen, onClose }: Props) {
  const job = getJobById(jobId);
  const [dynamicEntries, setDynamicEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDynamicEntries(getStoredAuditEntriesByJobId(jobId));
    }
  }, [isOpen, jobId]);

  const staticEntries = getAuditEntriesByJobId(jobId);
  const allEntries = [...dynamicEntries, ...staticEntries].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const entries = allEntries;

  function handleExportPdf() {
    const lines: string[] = [
      `AUDIT TRAIL REPORT`,
      `Job: ${job?.title ?? jobId}`,
      `Department: ${job?.department ?? "—"}`,
      `Generated: ${new Date().toLocaleString("id-ID")}`,
      `Total entries: ${entries.length}`,
      ``,
      `${"─".repeat(60)}`,
      ``,
    ];

    entries.forEach((e, i) => {
      const candidate = getCandidateById(e.candidateId);
      lines.push(`${i + 1}. ${e.action}`);
      lines.push(`   Candidate: ${candidate?.name ?? (e.candidateId === "system" ? "—" : e.candidateId)}`);
      lines.push(`   Detail: ${e.details}`);
      lines.push(`   Actor: ${e.actor}`);
      lines.push(`   Time: ${formatAuditTime(e.timestamp)}`);
      lines.push(``);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-trail-${jobId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-[420px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900">Audit Trail</p>
              <p className="text-[10px] text-neutral-400 truncate max-w-[220px]">
                {job?.title ?? jobId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              leftIcon={<Download className="w-3 h-3" />}
              onClick={handleExportPdf}
            >
              Export
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-100 shrink-0">
          <div className="text-center">
            <p className="text-lg font-black text-neutral-900">{entries.length}</p>
            <p className="text-[10px] text-neutral-400">Total entries</p>
          </div>
          {(
            [
              "ranking_generated",
              "stage_advanced",
              "document_sent",
              "medical_requested",
            ] as AuditEntityType[]
          ).map((type) => {
            const count = entries.filter((e) => e.entityType === type).length;
            if (!count) return null;
            return (
              <div key={type} className="text-center">
                <p className="text-lg font-black text-neutral-900">{count}</p>
                <p className="text-[10px] text-neutral-400">{AUDIT_LABEL[type]}</p>
              </div>
            );
          })}
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <Shield className="w-10 h-10 text-neutral-200 mb-3" />
              <p className="text-sm font-medium text-neutral-500">No audit entries yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Actions taken on this job will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {entries.map((entry) => {
                const candidate = getCandidateById(entry.candidateId);
                return (
                  <div key={entry.id} className="flex items-start gap-3 px-5 py-4">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${AUDIT_BG[entry.entityType]}`}
                    >
                      {AUDIT_ICON[entry.entityType]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800">
                        {entry.action}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                        {candidate?.name ?? (entry.candidateId === "system" ? "—" : entry.candidateId)}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                        {entry.details}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-neutral-400 whitespace-nowrap">
                        {formatAuditTime(entry.timestamp)}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
                        {entry.actor}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-full font-medium ${AUDIT_BG[entry.entityType]} ${AUDIT_TEXT[entry.entityType]}`}
                      >
                        {AUDIT_LABEL[entry.entityType]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
