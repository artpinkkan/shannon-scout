"use client";

import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import Button from "./Button";
import type { PipelineStage } from "@/lib/types";

const STAGE_CONFIG: Record<
  PipelineStage,
  { label: string; selectedStyle: string; dot: string; description: string }
> = {
  screening: {
    label: "Screening",
    selectedStyle: "border-neutral-400 bg-neutral-50 text-neutral-700",
    dot: "bg-neutral-400",
    description: "Initial review of application and resume",
  },
  interview: {
    label: "Interview",
    selectedStyle: "border-[#0E5E6F] bg-[#E6F4F7] text-[#0E5E6F]",
    dot: "bg-[#0E5E6F]",
    description: "Candidate is scheduled or in the interview process",
  },
  decision: {
    label: "Decision",
    selectedStyle: "border-amber-400 bg-amber-50 text-amber-700",
    dot: "bg-[#B45309]",
    description: "Under final review by the hiring team",
  },
  hired: {
    label: "Hired",
    selectedStyle: "border-green-500 bg-green-50 text-green-700",
    dot: "bg-[#1A7F4B]",
    description: "Candidate has accepted the offer",
  },
  rejected: {
    label: "Rejected",
    selectedStyle: "border-red-400 bg-red-50 text-red-700",
    dot: "bg-[#C0392B]",
    description: "Candidate did not proceed further",
  },
};

const STAGES: PipelineStage[] = [
  "screening",
  "interview",
  "decision",
  "hired",
  "rejected",
];

interface Props {
  candidateName: string;
  currentStage: PipelineStage;
  onConfirm: (newStage: PipelineStage, reason: string) => void;
  onClose: () => void;
}

export default function MoveStageModal({
  candidateName,
  currentStage,
  onConfirm,
  onClose,
}: Props) {
  const [selected, setSelected] = useState<PipelineStage>(currentStage);
  const [reason, setReason] = useState("");

  const hasChanged = selected !== currentStage;

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
            <h2 className="text-base font-bold text-neutral-900">Move Stage</h2>
            <p className="text-sm text-neutral-400 mt-0.5">{candidateName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition-colors mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stage options */}
        <div className="p-6 space-y-2">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Select new stage
          </p>
          {STAGES.map((stage) => {
            const cfg = STAGE_CONFIG[stage];
            const isCurrent = stage === currentStage;
            const isSelected = stage === selected;
            return (
              <label
                key={stage}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? cfg.selectedStyle
                    : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-900"
                }`}
              >
                <input
                  type="radio"
                  name="stage"
                  value={stage}
                  checked={isSelected}
                  onChange={() => setSelected(stage)}
                  className="accent-[#0E5E6F] shrink-0"
                />
                <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900">{cfg.label}</span>
                    {isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-full font-medium">
                        current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {cfg.description}
                  </p>
                </div>
                {isSelected && !isCurrent && (
                  <CheckCircle className="w-4 h-4 text-[#0E5E6F] shrink-0" />
                )}
              </label>
            );
          })}

          {/* Reason field — only shown when stage changes */}
          {hasChanged && (
            <div className="pt-2">
              <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                Reason{" "}
                <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Add a note about this stage change…"
                rows={2}
                className="w-full text-xs text-neutral-900 bg-white border border-neutral-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#0E5E6F] transition-colors placeholder:text-neutral-400"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!hasChanged}
            onClick={() => hasChanged && onConfirm(selected, reason)}
          >
            Confirm Move →
          </Button>
        </div>
      </div>
    </div>
  );
}
