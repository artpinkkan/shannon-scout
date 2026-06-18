"use client";

import React, { useState } from "react";
import { X, Download, FileText, CheckCircle } from "lucide-react";
import Button from "./Button";

interface Props {
  candidateName: string;
  jobTitle: string;
  interviewDate: string;
  onClose: () => void;
}

const FORMATS = [
  { id: "pdf", label: "PDF", desc: "Formatted document, best for sharing" },
  { id: "docx", label: "DOCX", desc: "Editable Word document" },
  { id: "txt", label: "TXT", desc: "Plain text, lightweight" },
  { id: "srt", label: "SRT", desc: "Subtitle format with timestamps" },
  { id: "json", label: "JSON", desc: "Raw data for integrations" },
];

export default function ExportModal({
  candidateName,
  jobTitle,
  interviewDate,
  onClose,
}: Props) {
  const [format, setFormat] = useState("pdf");
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeSpeakers, setIncludeSpeakers] = useState(true);
  const [exported, setExported] = useState(false);

  function handleExport() {
    const content = [
      `INTERVIEW TRANSCRIPT`,
      `Candidate: ${candidateName}`,
      `Position: ${jobTitle}`,
      `Date: ${interviewDate}`,
      `Format: ${format.toUpperCase()}`,
      ``,
      `[Transcript content would appear here]`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${candidateName.replace(/\s+/g, "-").toLowerCase()}.${format === "docx" ? "txt" : format}`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-neutral-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Export Transcript
            </h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              {candidateName} — {jobTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 mt-0.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Format selector */}
          <div>
            <p className="text-xs font-medium text-neutral-700 mb-2">Format</p>
            <div className="grid grid-cols-5 gap-1.5">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all ${
                    format === f.id
                      ? "border-[#0E5E6F] bg-[#E6F4F7]"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <FileText
                    className={`w-4 h-4 ${format === f.id ? "text-[#0E5E6F]" : "text-neutral-400"}`}
                  />
                  <span
                    className={`text-[11px] font-bold ${format === f.id ? "text-[#0E5E6F]" : "text-neutral-600"}`}
                  >
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              {FORMATS.find((f) => f.id === format)?.desc}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-neutral-700">Options</p>
            {[
              {
                id: "ts",
                label: "Include timestamps",
                value: includeTimestamps,
                set: setIncludeTimestamps,
              },
              {
                id: "sp",
                label: "Include speaker labels",
                value: includeSpeakers,
                set: setIncludeSpeakers,
              },
            ].map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  onClick={() => opt.set((v) => !v)}
                  className={`w-8 h-4.5 rounded-full transition-colors cursor-pointer relative ${
                    opt.value ? "bg-[#0E5E6F]" : "bg-neutral-200"
                  }`}
                  style={{ width: 32, height: 18 }}
                >
                  <div
                    className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                      opt.value ? "translate-x-[14px]" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <span className="text-sm text-neutral-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={
              exported ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )
            }
            onClick={handleExport}
          >
            {exported ? "Exported!" : `Export ${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
