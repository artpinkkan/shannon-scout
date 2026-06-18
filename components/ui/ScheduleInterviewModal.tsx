"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, User, Video, FileText } from "lucide-react";
import Button from "./Button";
import { JOBS, CANDIDATES } from "@/lib/mock-data";

export interface ScheduleData {
  candidateName: string;
  jobTitle: string;
  date: string;
  time: string;
  durationMinutes: number;
  interviewerName: string;
  interviewType: string;
  notes: string;
}

interface Props {
  prefilledCandidateId?: string;
  prefilledCandidateName?: string;
  prefilledJobId?: string;
  prefilledJobTitle?: string;
  onConfirm: (data: ScheduleData) => void;
  onClose: () => void;
}

const INTERVIEWERS = [
  "Sari Dewi Kusuma",
  "Budi Santoso",
  "Rina Wahyuni",
  "Ahmad Fauzi",
];
const INTERVIEW_TYPES = [
  "Technical",
  "Behavioral",
  "Cultural Fit",
  "General",
  "Final Round",
];
const DURATIONS = [30, 45, 60, 90];

export default function ScheduleInterviewModal({
  prefilledCandidateId,
  prefilledCandidateName,
  prefilledJobId,
  prefilledJobTitle,
  onConfirm,
  onClose,
}: Props) {
  const [candidateId, setCandidateId] = useState(prefilledCandidateId ?? "");
  const [jobId, setJobId] = useState(prefilledJobId ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(45);
  const [interviewer, setInterviewer] = useState(INTERVIEWERS[0]);
  const [interviewType, setInterviewType] = useState(INTERVIEW_TYPES[0]);
  const [notes, setNotes] = useState("");

  const resolvedCandidate =
    prefilledCandidateName ??
    CANDIDATES.find((c) => c.id === candidateId)?.name ??
    "";
  const resolvedJob =
    prefilledJobTitle ?? JOBS.find((j) => j.id === jobId)?.title ?? "";

  const canSubmit =
    (!!prefilledCandidateId || !!candidateId) &&
    (!!prefilledJobId || !!jobId) &&
    !!date &&
    !!time &&
    !!interviewer;

  const labelClass = "block text-xs font-medium text-neutral-700 mb-1.5";
  const inputClass =
    "w-full text-sm text-neutral-900 bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0E5E6F] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-neutral-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-neutral-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Schedule Interview
            </h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              {resolvedCandidate
                ? `for ${resolvedCandidate}`
                : "Set up a new interview session"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 mt-0.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Candidate selector (only when not pre-filled) */}
          {!prefilledCandidateId && (
            <div>
              <label className={labelClass}>Candidate</label>
              <select
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select candidate…</option>
                {CANDIDATES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.jobTitle}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Job selector (only when not pre-filled) */}
          {!prefilledJobId && (
            <div>
              <label className={labelClass}>Job Position</label>
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select position…</option>
                {JOBS.filter((j) => j.status === "active").map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} — {j.department}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pre-filled summary chips */}
          {(prefilledCandidateName || prefilledJobTitle) && (
            <div className="flex flex-wrap gap-2">
              {prefilledCandidateName && (
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-[#E6F4F7] text-[#0E5E6F] rounded-full font-medium">
                  <User className="w-3 h-3" />
                  {prefilledCandidateName}
                </span>
              )}
              {prefilledJobTitle && (
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full font-medium">
                  <Video className="w-3 h-3" />
                  {prefilledJobTitle}
                </span>
              )}
            </div>
          )}

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Date
                </span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Time
                </span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className={labelClass}>Duration</label>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                    duration === d
                      ? "bg-[#0E5E6F] text-white border-[#0E5E6F]"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Type + Interviewer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <Video className="w-3 h-3" /> Interview Type
                </span>
              </label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className={inputClass}
              >
                {INTERVIEW_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Interviewer
                </span>
              </label>
              <select
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                className={inputClass}
              >
                {INTERVIEWERS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> Notes{" "}
                <span className="font-normal text-neutral-400">(optional)</span>
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interview instructions, topics to cover…"
              rows={2}
              className="w-full text-sm text-neutral-900 bg-white border border-neutral-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#0E5E6F] transition-colors placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100 shrink-0">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!canSubmit}
            onClick={() =>
              canSubmit &&
              onConfirm({
                candidateName: resolvedCandidate,
                jobTitle: resolvedJob,
                date,
                time,
                durationMinutes: duration,
                interviewerName: interviewer,
                interviewType,
                notes,
              })
            }
          >
            Schedule Interview →
          </Button>
        </div>
      </div>
    </div>
  );
}
