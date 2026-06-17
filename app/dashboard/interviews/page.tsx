import React from "react";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import { INTERVIEWS } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Video, Clock, CheckCircle, XCircle, Calendar, Mic, Plus } from "lucide-react";
import Link from "next/link";

const statusConfig = {
  live: { variant: "danger" as const, icon: <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />, label: "Live" },
  scheduled: { variant: "info" as const, icon: <Clock className="w-3.5 h-3.5" />, label: "Scheduled" },
  completed: { variant: "success" as const, icon: <CheckCircle className="w-3.5 h-3.5" />, label: "Completed" },
  cancelled: { variant: "neutral" as const, icon: <XCircle className="w-3.5 h-3.5" />, label: "Cancelled" },
};

export default function InterviewsPage() {
  const sorted = [...INTERVIEWS].sort(
    (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

  const liveInterviews = sorted.filter((i) => i.status === "live");
  const upcomingInterviews = sorted.filter((i) => i.status === "scheduled");
  const pastInterviews = sorted.filter((i) => ["completed", "cancelled"].includes(i.status));

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Interviews" subtitle="Schedule, join, and review interview sessions" />

      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Interviews"
          description={`${liveInterviews.length} live · ${upcomingInterviews.length} upcoming · ${pastInterviews.length} completed`}
          actions={
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Schedule Interview
            </Button>
          }
        />

        {/* Live interviews */}
        {liveInterviews.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-sm font-semibold text-red-400">Live Now</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {liveInterviews.map((iv) => (
                <InterviewCard key={iv.id} interview={iv} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcomingInterviews.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Upcoming</h2>
            <div className="grid grid-cols-2 gap-3">
              {upcomingInterviews.map((iv) => (
                <InterviewCard key={iv.id} interview={iv} />
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Completed</h2>
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#252d40]">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Candidate</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Position</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Interviewer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Duration</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">ASR</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {pastInterviews.map((iv, idx) => (
                  <tr
                    key={iv.id}
                    className={`hover:bg-[#1a2030] transition-colors ${idx === pastInterviews.length - 1 ? "" : "border-b border-[#252d40]"}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-200">
                      {iv.candidateName}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px]">
                      <span className="truncate block">{iv.jobTitle}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{iv.interviewerName}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(iv.scheduledAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{iv.durationMinutes} min</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400">{iv.asrProvider}</span>
                        {iv.wer !== undefined && (
                          <span className="text-[10px] text-slate-600">WER {iv.wer}%</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {statusConfig[iv.status].icon}
                        <Badge variant={statusConfig[iv.status].variant} size="sm">
                          {statusConfig[iv.status].label}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {iv.transcriptReady && (
                          <Link href={`/dashboard/interviews/${iv.id}/review`}>
                            <Button variant="ghost" size="xs" leftIcon={<Mic className="w-3 h-3" />}>
                              Review
                            </Button>
                          </Link>
                        )}
                        <Link href={`/dashboard/interviews/${iv.id}`}>
                          <Button variant="secondary" size="xs">
                            View
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function InterviewCard({ interview }: { interview: typeof INTERVIEWS[0] }) {
  const cfg = statusConfig[interview.status];
  return (
    <div
      className={[
        "bg-[#161b27] border rounded-xl p-4",
        interview.status === "live" ? "border-red-600/40" : "border-[#252d40]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">{interview.candidateName}</p>
          <p className="text-xs text-slate-500">{interview.jobTitle}</p>
        </div>
        <Badge variant={cfg.variant} size="sm" dot={interview.status === "live"}>
          {cfg.label}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Video className="w-3.5 h-3.5 text-slate-500" />
          {interview.interviewerName}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          {new Date(interview.scheduledAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
          })}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {interview.durationMinutes} min
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href={`/dashboard/interviews/${interview.id}`} className="flex-1">
          <Button
            variant={interview.status === "live" ? "danger" : "primary"}
            size="sm"
            fullWidth
            leftIcon={<Video className="w-4 h-4" />}
          >
            {interview.status === "live" ? "Join Room" : "Open Room"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
