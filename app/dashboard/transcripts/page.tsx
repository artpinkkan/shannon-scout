"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { INTERVIEWS } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ExportModal from "@/components/ui/ExportModal";
import { Download, FileText } from "lucide-react";
import Link from "next/link";
import type { Interview } from "@/lib/types";

export default function TranscriptsPage() {
  const completedInterviews = INTERVIEWS.filter((i) => i.status === "completed" && i.transcriptReady);
  const [exportTarget, setExportTarget] = useState<Interview | null>(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Transcripts"
        subtitle="All completed interview transcripts"
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">Transcripts</h1>
            <p className="text-sm text-neutral-400 mt-0.5">{completedInterviews.length} transcripts available</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Interview</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Candidate</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">ASR</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {completedInterviews.map((iv, idx) => (
                <tr
                  key={iv.id}
                  className={`hover:bg-neutral-50 transition-colors ${idx < completedInterviews.length - 1 ? "border-b border-neutral-100" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="text-sm font-medium text-neutral-700 truncate max-w-[180px]">
                        {iv.jobTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-700">{iv.candidateName}</td>
                  <td className="px-4 py-3 text-xs text-neutral-400">
                    {new Date(iv.scheduledAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-400">{iv.durationMinutes} min</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-neutral-700">{iv.asrProvider}</span>
                      {iv.wer !== undefined && (
                        <span className="text-[10px] text-neutral-400">WER {iv.wer}%</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="success" size="sm">Authoritative</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/interviews/${iv.id}/review`}>
                        <Button variant="ghost" size="xs">Review</Button>
                      </Link>
                      <Button
                        variant="secondary"
                        size="xs"
                        leftIcon={<Download className="w-3 h-3" />}
                        onClick={() => setExportTarget(iv)}
                      >
                        Export
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {completedInterviews.length === 0 && (
            <div className="py-12 text-center text-neutral-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No transcripts available yet.</p>
            </div>
          )}
        </div>
      </div>

      {exportTarget && (
        <ExportModal
          candidateName={exportTarget.candidateName}
          jobTitle={exportTarget.jobTitle}
          interviewDate={new Date(exportTarget.scheduledAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })}
          onClose={() => setExportTarget(null)}
        />
      )}
    </div>
  );
}
