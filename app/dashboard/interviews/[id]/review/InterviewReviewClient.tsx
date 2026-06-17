"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import {
  getInterviewById,
  getTranscriptByInterviewId,
  getReviewByInterviewId,
  formatTimestamp,
} from "@/lib/mock-data";
import type { TranscriptSegment } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import {
  FileText,
  Sparkles,
  CheckSquare,
  Tag,
  Search,
  Download,
  Edit3,
  Filter,
  ThumbsUp,
  AlertCircle,
  Calendar,
  User,
  Clock,
  ChevronRight,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import Link from "next/link";

const EXPORT_FORMATS = [
  { label: "DOCX", icon: "📄" },
  { label: "PDF", icon: "📕" },
  { label: "SRT", icon: "📝" },
  { label: "VTT", icon: "🌐" },
  { label: "JSON", icon: "{ }" },
];

const recommendationConfig = {
  strong_hire: { label: "Strong Hire", variant: "success" as const, color: "text-emerald-400" },
  hire: { label: "Hire", variant: "success" as const, color: "text-emerald-300" },
  no_hire: { label: "No Hire", variant: "danger" as const, color: "text-red-400" },
  strong_no_hire: { label: "Strong No Hire", variant: "danger" as const, color: "text-red-500" },
};

function TranscriptSegmentRow({
  segment,
  isEditing,
  searchQuery,
}: {
  segment: TranscriptSegment;
  isEditing: boolean;
  searchQuery: string;
}) {
  const [editText, setEditText] = useState(segment.text);

  const highlightSearch = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div
      className={`flex gap-4 py-3 px-4 hover:bg-neutral-50 transition-colors group border-b border-neutral-100 ${
        segment.hasCodeSwitch ? "border-l-2 border-l-[#B45309]/30" : ""
      }`}
    >
      <div className="shrink-0 pt-0.5">
        <button className="text-[11px] font-mono text-[#0E5E6F] hover:text-[#0E5E6F] transition-colors w-12 text-right">
          {formatTimestamp(segment.startTime)}
        </button>
      </div>

      <div className="shrink-0 pt-0.5">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
            segment.speaker === "S1"
              ? "bg-[#E6F4F7] text-[#0E5E6F]"
              : "bg-amber-600/20 text-amber-400"
          }`}
        >
          {segment.speaker}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-neutral-50 border border-[#0E5E6F]/50 text-neutral-700 text-sm px-2 py-1 rounded resize-none focus:outline-none"
            rows={2}
          />
        ) : (
          <p className="text-sm text-neutral-700 leading-relaxed">
            {highlightSearch(segment.text)}
          </p>
        )}

        {segment.keyTerms && segment.keyTerms.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {segment.keyTerms.map((kt) => (
              <span
                key={kt}
                className="text-[10px] px-1.5 py-0.5 bg-[#E6F4F7] text-[#0E5E6F] rounded border border-[#E6F4F7]"
              >
                {kt}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 pt-0.5 flex items-start gap-2">
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
            segment.confidence >= 0.93
              ? "bg-emerald-600/20 text-emerald-400"
              : "bg-amber-600/20 text-amber-400"
          }`}
        >
          {Math.round(segment.confidence * 100)}%
        </span>
        {segment.hasCodeSwitch && (
          <span className="text-[10px] px-1.5 py-0.5 bg-amber-600/10 text-amber-600 rounded">
            CS
          </span>
        )}
      </div>
    </div>
  );
}

export default function InterviewReviewClient() {
  const params = useParams();
  const interviewId = params.id as string;
  const interview = getInterviewById(interviewId);
  const transcript = getTranscriptByInterviewId(interviewId);
  const review = getReviewByInterviewId(interviewId);

  const [activeTab, setActiveTab] = useState("summary");
  const [searchQuery, setSearchQuery] = useState("");
  const [speakerFilter, setSpeakerFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handleExport = (format: string) => {
    showToast(`Export started — ${format} will be ready shortly`, "success");
  };

  if (!interview) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Not Found" />
        <div className="flex-1 flex items-center justify-center text-neutral-400">
          Interview not found.
        </div>
      </div>
    );
  }

  const filteredTranscript = transcript.filter((seg) => {
    const matchesSpeaker = speakerFilter === "all" || seg.speaker === speakerFilter;
    const matchesSearch =
      !searchQuery ||
      seg.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpeaker && matchesSearch;
  });

  const tabs = [
    {
      id: "summary",
      label: "Summary",
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: "transcript",
      label: "Transcript",
      icon: <FileText className="w-3.5 h-3.5" />,
      count: transcript.length,
    },
    {
      id: "actions",
      label: "Action Items",
      icon: <CheckSquare className="w-3.5 h-3.5" />,
      count: review?.actionItems.length,
    },
    {
      id: "topics",
      label: "Topics",
      icon: <Tag className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Interview Review"
        subtitle={`${interview.candidateName} · ${interview.jobTitle}`}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pb-0">
          <PageHeader
            title="Post-Interview AI Review"
            breadcrumbs={[
              { label: "Interviews", href: "/dashboard/interviews" },
              { label: interview.candidateName, href: `/dashboard/interviews/${interviewId}` },
              { label: "Review" },
            ]}
            actions={
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {EXPORT_FORMATS.map((fmt) => (
                    <Button
                      key={fmt.label}
                      variant="secondary"
                      size="xs"
                      leftIcon={<Download className="w-3 h-3" />}
                      onClick={() => handleExport(fmt.label)}
                    >
                      {fmt.label}
                    </Button>
                  ))}
                </div>
                <Link href={`/dashboard/interviews/${interviewId}`}>
                  <Button variant="ghost" size="sm">
                    Back to Room
                  </Button>
                </Link>
              </div>
            }
          />

          {review && (
            <div className="flex items-center gap-4 mb-5 p-3 bg-white border border-neutral-200 rounded-xl">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-400">
                  {interview.interviewerName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-400">
                  {new Date(interview.scheduledAt).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-400">
                  {interview.durationMinutes} min
                </span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-xs text-neutral-400">Overall:</span>
                <Badge
                  variant={recommendationConfig[review.overallRecommendation].variant}
                >
                  {recommendationConfig[review.overallRecommendation].label}
                </Badge>
              </div>
            </div>
          )}

          {!review && (
            <div className="mb-5 p-4 bg-amber-600/10 border border-amber-600/30 rounded-xl text-sm text-amber-400">
              AI review not available for this interview. Complete the interview first.
            </div>
          )}

          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-0"
          />
        </div>

        <div className="p-6 pt-5">
          {activeTab === "summary" && review && (
            <div className="space-y-5">
              <div
                className={`p-4 rounded-xl border ${
                  review.overallRecommendation.includes("hire") && !review.overallRecommendation.includes("no")
                    ? "bg-emerald-600/10 border-emerald-600/30"
                    : "bg-red-600/10 border-red-600/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant={recommendationConfig[review.overallRecommendation].variant}
                  >
                    {recommendationConfig[review.overallRecommendation].label}
                  </Badge>
                  <span className="text-xs text-neutral-400">
                    Generated {new Date(review.generatedAt).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Ringkasan (Bahasa Indonesia)
                    </span>
                    <Badge variant="info" size="sm">ID</Badge>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {review.summaryBahasa}
                  </p>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Summary (English)
                    </span>
                    <Badge variant="neutral" size="sm">EN</Badge>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {review.summaryEnglish}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-neutral-700">
                      Strength Highlights
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {review.strengthHighlights.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-neutral-700">
                      Concern Areas
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {review.concernAreas.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {review.keyDecisions.length > 0 && (
                <div className="bg-white border border-neutral-200 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-neutral-700 mb-3">
                    Key Decisions
                  </h3>
                  <div className="space-y-3">
                    {review.keyDecisions.map((kd) => (
                      <div
                        key={kd.id}
                        className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        <button className="text-[#0E5E6F] hover:text-[#0E5E6F] mt-0.5 text-xs shrink-0 font-mono">
                          {formatTimestamp(kd.timestamp)}
                        </button>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-700">
                            {kd.decision}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {kd.context}
                          </p>
                        </div>
                        <Badge variant="neutral" size="sm">
                          {kd.madeBy.split(" ")[0]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "transcript" && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search transcript..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-neutral-200 text-neutral-900 placeholder-slate-600 rounded-lg text-sm py-2 pl-8 pr-3 focus:outline-none focus:border-[#0E5E6F] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200 rounded-lg">
                  {["all", "S1", "S2"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeakerFilter(s)}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        speakerFilter === s
                          ? "bg-[#0E5E6F] text-white"
                          : "text-neutral-400 hover:text-neutral-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <Button
                  variant={isEditing ? "primary" : "secondary"}
                  size="sm"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => setIsEditing((v) => !v)}
                >
                  {isEditing ? "Save Edits" : "Edit Mode"}
                </Button>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => setIsPlaying((v) => !v)}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <div className="flex items-end gap-0.5 h-3">
                    {[2, 3, 5, 4, 3, 2, 4, 5, 3, 2].map((h, i) => (
                      <div
                        key={i}
                        className={`w-0.5 rounded-full transition-all ${
                          isPlaying ? "bg-indigo-400" : "bg-neutral-100"
                        }`}
                        style={{ height: `${h * 2}px` }}
                      />
                    ))}
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                {filteredTranscript.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 text-sm">
                    No transcript segments match your filters.
                  </div>
                ) : (
                  filteredTranscript.map((seg) => (
                    <TranscriptSegmentRow
                      key={seg.id}
                      segment={seg}
                      isEditing={isEditing}
                      searchQuery={searchQuery}
                    />
                  ))
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
                <span>{filteredTranscript.length} of {transcript.length} segments</span>
                <div className="flex items-center gap-3">
                  <span>
                    Code-switched: {transcript.filter((s) => s.hasCodeSwitch).length}
                  </span>
                  <span>
                    Avg confidence: {(transcript.reduce((a, s) => a + s.confidence, 0) / transcript.length * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "actions" && review && (
            <div className="space-y-3">
              {review.actionItems.map((ai) => (
                <div
                  key={ai.id}
                  className={`flex items-start gap-4 p-4 bg-white border rounded-xl transition-colors ${
                    ai.done ? "opacity-60 border-neutral-200" : "border-neutral-200 hover:border-[#2e384d]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer ${
                      ai.done
                        ? "bg-emerald-600 border-emerald-600"
                        : "border-[#2e384d]"
                    }`}
                  >
                    {ai.done && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8L2 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${ai.done ? "line-through text-neutral-400" : "text-neutral-700"}`}>
                      {ai.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-neutral-400">
                        Assignee: <span className="text-neutral-400">{ai.assignee}</span>
                      </span>
                      <span className="text-xs text-neutral-400">
                        Due: <span className="text-neutral-400">{ai.dueDate}</span>
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={ai.priority === "high" ? "danger" : ai.priority === "medium" ? "warning" : "neutral"}
                    size="sm"
                  >
                    {ai.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {activeTab === "topics" && review && (
            <div className="space-y-3">
              {review.topicSegments.map((topic, i) => (
                <div
                  key={topic.id}
                  className="bg-white border border-neutral-200 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#E6F4F7] border border-indigo-600/30 flex items-center justify-center text-xs font-bold text-[#0E5E6F]">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-700">
                          {topic.topic}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-[#0E5E6F]">
                            {formatTimestamp(topic.startTime)}
                          </span>
                          <ChevronRight className="w-3 h-3 text-neutral-400" />
                          <span className="text-[10px] font-mono text-[#0E5E6F]">
                            {formatTimestamp(topic.endTime)}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            ({topic.endTime - topic.startTime}s)
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-xs text-[#0E5E6F] hover:text-[#0E5E6F] flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      Jump
                    </button>
                  </div>

                  <p className="text-sm text-neutral-400 mb-3">{topic.summaryLine}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {topic.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-2 py-0.5 bg-[#E6F4F7] text-[#0E5E6F] rounded-full border border-[#E6F4F7]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
