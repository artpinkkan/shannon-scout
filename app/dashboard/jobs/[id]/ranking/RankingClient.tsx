"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getJobById,
  getCandidateById,
  getInterviewById,
  getRankingsByJobId,
  formatTimestamp,
} from "@/lib/mock-data";
import type {
  CandidateRanking,
  NextActionType,
  ScoreDimension,
} from "@/lib/types";
import { addAuditEntry } from "@/lib/audit-store";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Sparkles,
  Trophy,
  Medal,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  FileSignature,
  PenLine,
  CheckCircle,
  ExternalLink,
  X,
  Play,
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

type SortKey = "aiScore" | ScoreDimension;

const DIMENSION_LABELS: Record<ScoreDimension, string> = {
  communicationClarity: "Communication",
  technicalDepth: "Technical",
  culturalFit: "Cultural Fit",
  experienceRelevance: "Experience",
};

const DIMENSION_SHORT: Record<ScoreDimension, string> = {
  communicationClarity: "Comm",
  technicalDepth: "Tech",
  culturalFit: "Fit",
  experienceRelevance: "Exp",
};

function formatInterviewDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Score helpers ────────────────────────────────────────────────────────────

function ScoreBar({
  value,
  color = "bg-[#0E5E6F]",
  height = "h-1",
}: {
  value: number;
  color?: string;
  height?: string;
}) {
  return (
    <div className={`w-full ${height} bg-neutral-100 rounded-full overflow-hidden`}>
      <div
        className={`${height} ${color} rounded-full transition-all`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function scoreColor(v: number) {
  if (v >= 85) return "text-[#1A7F4B]";
  if (v >= 70) return "text-[#B45309]";
  return "text-[#C0392B]";
}

function scoreBarColor(v: number) {
  if (v >= 85) return "bg-[#1A7F4B]";
  if (v >= 70) return "bg-[#B45309]";
  return "bg-[#C0392B]";
}

// ─── Top row (simplified) ─────────────────────────────────────────────────────

const RANK_CONFIG = [
  {
    icon: <Trophy className="w-3.5 h-3.5 text-amber-500" />,
    badge: "bg-amber-100 text-amber-700",
    accent: "border-l-amber-300",
  },
  {
    icon: <Medal className="w-3.5 h-3.5 text-neutral-400" />,
    badge: "bg-neutral-100 text-neutral-500",
    accent: "border-l-neutral-200",
  },
  {
    icon: <Medal className="w-3.5 h-3.5 text-orange-400" />,
    badge: "bg-orange-100 text-orange-600",
    accent: "border-l-orange-300",
  },
];

const DIMS: ScoreDimension[] = [
  "communicationClarity",
  "technicalDepth",
  "culturalFit",
  "experienceRelevance",
];

function TopRow({
  ranking,
  rank,
  onContinue,
  actionTaken,
}: {
  ranking: CandidateRanking;
  rank: number;
  onContinue: () => void;
  actionTaken: boolean;
}) {
  const candidate = getCandidateById(ranking.candidateId);
  const cfg = RANK_CONFIG[rank] ?? RANK_CONFIG[2];
  if (!candidate) return null;

  return (
    <div
      className={`flex items-center gap-5 bg-white border border-neutral-200 border-l-4 ${cfg.accent} rounded-xl px-5 py-4`}
    >
      {/* Rank */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>
          #{rank + 1}
        </span>
        {cfg.icon}
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-3 w-56 shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ backgroundColor: candidate.avatarColor }}
        >
          {candidate.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{candidate.name}</p>
          <p className="text-[11px] text-neutral-400 truncate">
            {candidate.currentRole} · {candidate.currentCompany}
          </p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="flex items-center gap-6 flex-1">
        {DIMS.map((dim) => (
          <div key={dim} className="flex flex-col items-center gap-0.5 min-w-[36px]">
            <span className={`text-sm font-bold ${scoreColor(ranking.scoreBreakdown[dim])}`}>
              {ranking.scoreBreakdown[dim]}
            </span>
            <span className="text-[9px] text-neutral-400 uppercase tracking-wide">
              {DIMENSION_SHORT[dim]}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-neutral-100 shrink-0" />

      {/* Total score */}
      <div className="shrink-0 text-right w-14">
        <span className={`text-2xl font-black leading-none ${scoreColor(ranking.aiScore)}`}>
          {ranking.aiScore}
        </span>
        <span className="text-xs text-neutral-400">/100</span>
      </div>

      {/* Action */}
      <div className="shrink-0">
        {actionTaken ? (
          <div className="flex items-center gap-1.5 text-[11px] text-[#1A7F4B] font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Logged
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={onContinue}>
            Continue →
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Evidence panel ───────────────────────────────────────────────────────────

function EvidencePanel({
  ranking,
  onClose,
}: {
  ranking: CandidateRanking;
  onClose: () => void;
}) {
  const candidate = getCandidateById(ranking.candidateId);
  const interview = getInterviewById(ranking.interviewId);

  return (
    <div className="mt-2 mb-3 mx-1 bg-[#F7FBFC] border border-[#E6F4F7] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#0E5E6F]" />
          <span className="text-xs font-semibold text-neutral-700">
            Transcript Evidence — {candidate?.name}
          </span>
          {interview && (
            <Link
              href={`/dashboard/interviews/${ranking.interviewId}/review`}
              className="flex items-center gap-1 text-[10px] text-[#0E5E6F] hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Full transcript
            </Link>
          )}
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-3">
        {ranking.transcriptEvidence.map((ev, i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] px-1.5 py-0.5 bg-[#E6F4F7] text-[#0E5E6F] rounded font-medium">
                {DIMENSION_LABELS[ev.dimension]}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                @ {formatTimestamp(ev.timestamp)}
              </span>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed italic">
              "{ev.quote}"
            </p>
          </div>
        ))}
        {ranking.transcriptEvidence.length === 0 && (
          <p className="text-xs text-neutral-400 text-center py-2">No evidence segments available.</p>
        )}
      </div>
    </div>
  );
}

// ─── Continue-process modal ───────────────────────────────────────────────────

function ContinueModal({
  ranking,
  onConfirm,
  onClose,
}: {
  ranking: CandidateRanking;
  onConfirm: (action: NextActionType, note: string) => void;
  onClose: () => void;
}) {
  const candidate = getCandidateById(ranking.candidateId);
  const [selected, setSelected] = useState<NextActionType | null>(null);
  const [customNote, setCustomNote] = useState("");

  const options: { id: NextActionType; label: string; sublabel: string; icon: React.ReactNode }[] = [
    {
      id: "medical_checkup",
      label: "Medical Check-Up",
      sublabel: "Schedule and send a medical check-up request to the candidate.",
      icon: <Stethoscope className="w-4 h-4 text-amber-500" />,
    },
    {
      id: "employment_agreement",
      label: "Send Employment Agreement (PKS / Contract)",
      sublabel: "Generate and send the employment contract for review and e-signature.",
      icon: <FileSignature className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: "custom",
      label: "Custom Step",
      sublabel: "Define an ad-hoc next action for this candidate.",
      icon: <PenLine className="w-4 h-4 text-neutral-500" />,
    },
  ];

  const canConfirm = selected !== null && (selected !== "custom" || customNote.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-neutral-200">
        <div className="flex items-start justify-between p-6 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Continue Process</h2>
            <div className="flex items-center gap-2 mt-1">
              {candidate && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ backgroundColor: candidate.avatarColor }}
                >
                  {candidate.avatarInitials}
                </div>
              )}
              <span className="text-sm text-neutral-500">{candidate?.name}</span>
              <span className="text-[11px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded font-medium">
                Score {ranking.aiScore}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 mt-0.5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
            Select next step
          </p>
          {options.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                selected === opt.id
                  ? "border-[#0E5E6F] bg-[#E6F4F7]"
                  : "border-neutral-200 hover:border-neutral-300 bg-white"
              }`}
            >
              <input
                type="radio"
                name="action"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
                className="mt-0.5 accent-[#0E5E6F]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  {opt.icon}
                  <span className="text-sm font-medium text-neutral-800">{opt.label}</span>
                </div>
                <p className="text-xs text-neutral-400">{opt.sublabel}</p>
                {opt.id === "custom" && selected === "custom" && (
                  <textarea
                    autoFocus
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Describe the custom action…"
                    rows={2}
                    className="mt-2 w-full text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#0E5E6F] transition-colors"
                  />
                )}
              </div>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => selected && onConfirm(selected, customNote)}
            disabled={!canConfirm}
          >
            Confirm Action →
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RankingClient() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const job = getJobById(jobId);
  const baseRankings = getRankingsByJobId(jobId);

  const [sortKey, setSortKey] = useState<SortKey>("aiScore");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);
  const [modal, setModal] = useState<CandidateRanking | null>(null);
  const [actioned, setActioned] = useState<Set<string>>(new Set());
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    if (job) {
      addAuditEntry({
        jobId,
        candidateId: "system",
        entityType: "ranking_generated",
        action: "AI Ranking viewed",
        details: `Recruiter opened the AI Ranking page for ${job.title} (${baseRankings.length} candidates)`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const sorted = useMemo(() => {
    return [...baseRankings].sort((a, b) => {
      const av = sortKey === "aiScore" ? a.aiScore : a.scoreBreakdown[sortKey];
      const bv = sortKey === "aiScore" ? b.aiScore : b.scoreBreakdown[sortKey];
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [baseRankings, sortKey, sortDir]);

  const top3 = useMemo(
    () => [...baseRankings].sort((a, b) => b.aiScore - a.aiScore).slice(0, 3),
    [baseRankings]
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 text-neutral-400" />;
    return sortDir === "desc"
      ? <ArrowDown className="w-3 h-3 text-[#0E5E6F]" />
      : <ArrowUp className="w-3 h-3 text-[#0E5E6F]" />;
  }

  function handleConfirm(action: NextActionType, note: string) {
    if (!modal) return;
    const candidate = getCandidateById(modal.candidateId);
    const actionLabel =
      action === "medical_checkup"
        ? "Medical Check-Up requested"
        : action === "employment_agreement"
        ? "Employment Agreement (PKS) sent"
        : `Custom: ${note}`;

    const entityType =
      action === "medical_checkup"
        ? "medical_requested" as const
        : action === "employment_agreement"
        ? "document_sent" as const
        : "custom_action" as const;

    addAuditEntry({
      jobId,
      candidateId: modal.candidateId,
      entityType,
      action: actionLabel,
      details: action === "custom" ? note : `Triggered from AI Ranking — AI Score: ${modal.aiScore}`,
    });

    setActioned((prev) => {
      const next = new Set(prev);
      next.add(modal.candidateId);
      return next;
    });
    setModal(null);
    showToast(`${actionLabel} — logged for ${candidate?.name}`, "success");
  }

  if (!job) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm">
        Job not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-neutral-50">
      {/* ── Header ── */}
      <div className="shrink-0 px-6 py-4 bg-white border-b border-neutral-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-neutral-900">{job.title}</h1>
                <span className="text-[10px] px-2 py-0.5 bg-[#E6F4F7] text-[#0E5E6F] rounded-full font-medium">
                  AI Ranking
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {job.department} · {job.location} · {baseRankings.length} candidate
                {baseRankings.length !== 1 ? "s" : ""} ranked
              </p>
            </div>
          </div>
          <Link href={`/dashboard/jobs/${jobId}`}>
            <Button variant="ghost" size="sm">View Job →</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-[#F7FBFC] border border-[#E6F4F7] rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-[#0E5E6F] shrink-0" />
          <p className="text-xs text-neutral-600">
            AI scores are derived from interview transcript analysis — communication clarity,
            technical depth, cultural fit, and experience relevance. Each score is traceable
            to specific transcript segments.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">

          {/* ── Empty state ── */}
          {baseRankings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Trophy className="w-12 h-12 text-neutral-200 mb-4" />
              <p className="text-sm font-medium text-neutral-500">No rankings yet for this role</p>
              <p className="text-xs text-neutral-400 mt-1">
                Rankings are generated automatically when an interview session ends.
              </p>
            </div>
          )}

          {/* ── Top Candidates ── */}
          {top3.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-neutral-800">
                  Top {top3.length} Candidates
                </h2>
                <span className="text-[10px] text-neutral-400">sorted by AI score</span>
              </div>
              <div className="flex flex-col gap-2">
                {top3.map((r, i) => (
                  <TopRow
                    key={r.id}
                    ranking={r}
                    rank={i}
                    onContinue={() => setModal(r)}
                    actionTaken={actioned.has(r.candidateId)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Full Rankings Table ── */}
          {sorted.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-neutral-800">
                  All Candidates ({sorted.length})
                </h2>
                <p className="text-[11px] text-neutral-400">Click column headers to sort</p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[40px_1fr_90px_220px_1fr_130px] border-b border-neutral-100 bg-neutral-50 px-4 py-2.5">
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">#</div>
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Candidate</div>
                  <button
                    onClick={() => toggleSort("aiScore")}
                    className="flex items-center gap-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider hover:text-neutral-700 transition-colors"
                  >
                    AI Score <SortIcon k="aiScore" />
                  </button>
                  <div className="flex items-center gap-3 pl-1">
                    {DIMS.map((d) => (
                      <button
                        key={d}
                        onClick={() => toggleSort(d)}
                        className="flex items-center gap-0.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider hover:text-neutral-700 transition-colors"
                      >
                        {DIMENSION_SHORT[d]} <SortIcon k={d} />
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Reasoning</div>
                  <div />
                </div>

                {/* Table rows */}
                {sorted.map((r, idx) => {
                  const candidate = getCandidateById(r.candidateId);
                  const interview = getInterviewById(r.interviewId);
                  const evidenceOpen = expandedEvidence === r.id;

                  return (
                    <React.Fragment key={r.id}>
                      <div
                        className={`grid grid-cols-[40px_1fr_90px_220px_1fr_130px] items-center px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${evidenceOpen ? "bg-[#F7FBFC]" : ""}`}
                      >
                        <div className="flex items-center">
                          <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
                        </div>

                        <div className="flex items-center gap-2.5 min-w-0 pr-3">
                          {candidate && (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                              style={{ backgroundColor: candidate.avatarColor }}
                            >
                              {candidate.avatarInitials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-neutral-900 truncate">
                              {candidate?.name ?? r.candidateId}
                            </p>
                            <p className="text-[10px] text-neutral-400 truncate">
                              {candidate?.currentRole} · {candidate?.currentCompany}
                            </p>
                            {interview && (
                              <p className="text-[10px] text-neutral-400 truncate">
                                {formatInterviewDate(interview.scheduledAt)} · {interview.durationMinutes} min
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="pr-3">
                          <div className={`text-lg font-black ${scoreColor(r.aiScore)}`}>{r.aiScore}</div>
                          <ScoreBar value={r.aiScore} color={scoreBarColor(r.aiScore)} height="h-1" />
                        </div>

                        <div className="flex items-center gap-3 pr-3">
                          {DIMS.map((d) => (
                            <div key={d} className="flex flex-col items-center gap-0.5">
                              <span className={`text-xs font-bold ${scoreColor(r.scoreBreakdown[d])}`}>
                                {r.scoreBreakdown[d]}
                              </span>
                              <span className="text-[9px] text-neutral-400">{DIMENSION_SHORT[d]}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pr-3">
                          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{r.reasoning}</p>
                          <button
                            onClick={() => setExpandedEvidence(evidenceOpen ? null : r.id)}
                            className="flex items-center gap-1 mt-1 text-[10px] text-[#0E5E6F] hover:text-[#09414D] transition-colors"
                          >
                            <Play className="w-2.5 h-2.5" />
                            {evidenceOpen ? "Hide" : "Show"} transcript evidence
                            {evidenceOpen ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                          </button>
                        </div>

                        <div className="flex justify-end">
                          {actioned.has(r.candidateId) ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-[#1A7F4B] font-medium">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Logged
                            </div>
                          ) : (
                            <Button variant="primary" size="xs" onClick={() => setModal(r)}>
                              Continue Process
                            </Button>
                          )}
                        </div>
                      </div>

                      {evidenceOpen && (
                        <div className="px-4">
                          <EvidencePanel ranking={r} onClose={() => setExpandedEvidence(null)} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </div>

      {modal && (
        <ContinueModal
          ranking={modal}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
