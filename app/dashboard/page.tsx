import React from "react";
import Header from "@/components/layout/Header";
import {
  JOBS,
  CANDIDATES,
  INTERVIEWS,
  TENANTS,
  ADMIN_STATS,
  formatCurrency,
} from "@/lib/mock-data";
import {
  Briefcase,
  Users,
  Video,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Mic,
} from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

const statCards = [
  {
    label: "Active Jobs",
    value: JOBS.filter((j) => j.status === "active").length,
    icon: <Briefcase className="w-5 h-5" />,
    color: "text-indigo-400",
    bg: "bg-indigo-600/10",
    change: "+2 this week",
    positive: true,
  },
  {
    label: "Total Candidates",
    value: CANDIDATES.length,
    icon: <Users className="w-5 h-5" />,
    color: "text-emerald-400",
    bg: "bg-emerald-600/10",
    change: "+4 this week",
    positive: true,
  },
  {
    label: "Interviews Scheduled",
    value: INTERVIEWS.filter((i) =>
      ["live", "scheduled"].includes(i.status)
    ).length,
    icon: <Video className="w-5 h-5" />,
    color: "text-sky-400",
    bg: "bg-sky-600/10",
    change: "1 live now",
    positive: true,
  },
  {
    label: "Hours Transcribed",
    value: ADMIN_STATS.totalHoursTranscribed,
    icon: <Mic className="w-5 h-5" />,
    color: "text-purple-400",
    bg: "bg-purple-600/10",
    change: `Avg WER ${ADMIN_STATS.avgWER}%`,
    positive: true,
  },
];

function StageProgressBar() {
  const stages = [
    { label: "Screening", count: CANDIDATES.filter((c) => c.stage === "screening").length, color: "bg-slate-500" },
    { label: "Interview", count: CANDIDATES.filter((c) => c.stage === "interview").length, color: "bg-indigo-500" },
    { label: "Decision", count: CANDIDATES.filter((c) => c.stage === "decision").length, color: "bg-amber-500" },
    { label: "Hired", count: CANDIDATES.filter((c) => c.stage === "hired").length, color: "bg-emerald-500" },
    { label: "Rejected", count: CANDIDATES.filter((c) => c.stage === "rejected").length, color: "bg-red-500" },
  ];
  const total = CANDIDATES.length;

  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-3">
        {stages.map((s) => (
          <div
            key={s.label}
            className={`${s.color} transition-all`}
            style={{ width: `${(s.count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {stages.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${s.color}`} />
            <span className="text-xs text-slate-400">{s.label}</span>
            <span className="text-xs font-semibold text-slate-200">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const activeJobs = JOBS.filter((j) => j.status === "active").slice(0, 5);
  const recentInterviews = [...INTERVIEWS]
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, Sari — ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#161b27] border border-[#252d40] rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-400">{stat.label}</p>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Pipeline overview */}
          <div className="col-span-2 bg-[#161b27] border border-[#252d40] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200">Candidate Pipeline</h2>
              <Link
                href="/dashboard/candidates"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <StageProgressBar />

            <div className="mt-5 space-y-2">
              {CANDIDATES.filter((c) => ["interview", "decision"].includes(c.stage)).slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/candidates/${c.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1e2535] transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: c.avatarColor }}
                  >
                    {c.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{c.jobTitle}</p>
                  </div>
                  <Badge
                    variant={
                      c.stage === "interview"
                        ? "info"
                        : c.stage === "decision"
                        ? "warning"
                        : "success"
                    }
                    size="sm"
                  >
                    {c.stage.charAt(0).toUpperCase() + c.stage.slice(1)}
                  </Badge>
                  <div className="text-xs font-semibold text-slate-300">{c.score}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Tenants */}
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">Organizations</h2>
            <div className="space-y-3">
              {TENANTS.map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: t.color + "33", color: t.color }}
                  >
                    {t.logoInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{t.shortName}</p>
                    <p className="text-[10px] text-slate-500">{t.interviewHours}h transcribed</p>
                  </div>
                  {t.complianceFlag && (
                    <Badge variant="warning" size="sm">POJK</Badge>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#252d40]">
              <p className="text-xs text-slate-500 mb-1">Monthly Spend</p>
              <p className="text-lg font-bold text-slate-100">
                {formatCurrency(ADMIN_STATS.totalCostThisMonth)}
              </p>
              <div className="mt-2 h-1.5 bg-[#252d40] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: "67%" }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">67% of monthly budget</p>
            </div>
          </div>
        </div>

        {/* Recent interviews & active jobs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Recent interviews */}
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200">Recent Interviews</h2>
              <Link
                href="/dashboard/interviews"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentInterviews.map((iv) => (
                <Link
                  key={iv.id}
                  href={`/dashboard/interviews/${iv.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1e2535] transition-colors"
                >
                  <div className="shrink-0">
                    {iv.status === "live" ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse" />
                    ) : iv.status === "completed" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {iv.candidateName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">{iv.jobTitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={
                        iv.status === "live"
                          ? "danger"
                          : iv.status === "completed"
                          ? "success"
                          : iv.status === "scheduled"
                          ? "info"
                          : "neutral"
                      }
                      size="sm"
                      dot={iv.status === "live"}
                    >
                      {iv.status.charAt(0).toUpperCase() + iv.status.slice(1)}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Active jobs */}
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200">Active Jobs</h2>
              <Link
                href="/dashboard/jobs"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {activeJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1e2535] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#252d40] rounded-lg flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {job.title}
                    </p>
                    <p className="text-[10px] text-slate-500">{job.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-200">{job.applicantCount}</p>
                    <p className="text-[10px] text-slate-500">applicants</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
