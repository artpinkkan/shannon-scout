import React from "react";
import Header from "@/components/layout/Header";
import PageHeader from "@/components/layout/PageHeader";
import { ADMIN_STATS, TENANTS, formatCurrency } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import {
  BarChart3,
  Clock,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Shield,
  Mic,
  Zap,
} from "lucide-react";

// Simple bar chart using Tailwind
function BarChart({
  data,
  maxVal,
  color = "bg-indigo-600",
  height = "h-20",
}: {
  data: { label: string; value: number }[];
  maxVal: number;
  color?: string;
  height?: string;
}) {
  return (
    <div className={`flex items-end gap-2 ${height}`}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[9px] text-slate-500">{d.value}</span>
          <div
            className={`w-full ${color} rounded-t transition-all`}
            style={{
              height: `${((d.value / maxVal) * 100).toFixed(0)}%`,
              minHeight: "2px",
            }}
          />
          <span className="text-[9px] text-slate-600 truncate max-w-full">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const weeklyInterviews = [
  { label: "Mon", value: 6 },
  { label: "Tue", value: 9 },
  { label: "Wed", value: 7 },
  { label: "Thu", value: 12 },
  { label: "Fri", value: 8 },
  { label: "Sat", value: 3 },
  { label: "Sun", value: 2 },
];

const monthlyHours = [
  { label: "Jan", value: 38 },
  { label: "Feb", value: 52 },
  { label: "Mar", value: 61 },
  { label: "Apr", value: 45 },
  { label: "May", value: 78 },
  { label: "Jun", value: 94 },
];

export default function AdminPage() {
  const stats = ADMIN_STATS;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Admin Dashboard" subtitle="Platform-wide metrics and tenant usage" />

      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Admin Overview"
          description="Real-time metrics across all tenants and ASR providers"
        />

        {/* KPI grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Interviews",
              value: stats.totalInterviews.toLocaleString(),
              sub: `+${stats.interviewsThisWeek} this week`,
              icon: <Mic className="w-5 h-5" />,
              color: "text-indigo-400",
              bg: "bg-indigo-600/10",
              trend: "up",
            },
            {
              label: "Hours Transcribed",
              value: stats.totalHoursTranscribed.toString(),
              sub: "All time",
              icon: <Clock className="w-5 h-5" />,
              color: "text-sky-400",
              bg: "bg-sky-600/10",
              trend: "up",
            },
            {
              label: "Monthly Spend",
              value: formatCurrency(stats.totalCostThisMonth),
              sub: "All tenants",
              icon: <DollarSign className="w-5 h-5" />,
              color: "text-emerald-400",
              bg: "bg-emerald-600/10",
              trend: "up",
            },
            {
              label: "Active Tenants",
              value: stats.activeTenantsCount.toString(),
              sub: "All active",
              icon: <Users className="w-5 h-5" />,
              color: "text-purple-400",
              bg: "bg-purple-600/10",
              trend: "neutral",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-[#161b27] border border-[#252d40] rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-400">{kpi.label}</p>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <span className={kpi.color}>{kpi.icon}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : kpi.trend === "down" ? (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                ) : null}
                <p className="text-xs text-slate-500">{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quality metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                ASR Quality Metrics
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Word Error Rate (WER) and Diarisation Error Rate (DER) across providers
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Avg WER</span>
                  <Badge
                    variant={stats.avgWER < 10 ? "success" : "warning"}
                    size="sm"
                  >
                    {stats.avgWER}%
                  </Badge>
                </div>
                <div className="h-2 bg-[#252d40] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stats.avgWER < 10 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(stats.avgWER * 3, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">Target: &lt;10%</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Avg DER</span>
                  <Badge
                    variant={stats.avgDER < 8 ? "success" : "warning"}
                    size="sm"
                  >
                    {stats.avgDER}%
                  </Badge>
                </div>
                <div className="h-2 bg-[#252d40] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stats.avgDER < 8 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(stats.avgDER * 5, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">Target: &lt;8%</p>
              </div>
            </div>

            {/* Per-provider breakdown */}
            <div className="mt-4 space-y-2">
              {[
                { provider: "Google STT", wer: 8.2, der: 5.1, color: "bg-sky-600" },
                { provider: "Azure Speech", wer: 6.7, der: 4.3, color: "bg-blue-600" },
                { provider: "Whisper", wer: 11.4, der: 7.8, color: "bg-purple-600" },
              ].map((p) => (
                <div key={p.provider} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${p.color} shrink-0`} />
                  <span className="text-xs text-slate-400 w-24 shrink-0">{p.provider}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[#252d40] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${p.color} rounded-full`}
                        style={{ width: `${p.wer * 5}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 w-12 text-right">
                      WER {p.wer}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">Weekly Interviews</h2>
            </div>
            <BarChart
              data={weeklyInterviews}
              maxVal={Math.max(...weeklyInterviews.map((d) => d.value))}
              color="bg-indigo-600"
              height="h-24"
            />
            <p className="text-xs text-slate-500 mt-3 text-center">
              {stats.interviewsThisWeek} interviews this week
            </p>
          </div>
        </div>

        {/* Monthly hours chart */}
        <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                Monthly Transcription Hours
              </h2>
            </div>
            <Badge variant="success" size="sm">
              All Tenants
            </Badge>
          </div>
          <BarChart
            data={monthlyHours}
            maxVal={Math.max(...monthlyHours.map((d) => d.value))}
            color="bg-sky-600"
            height="h-28"
          />
        </div>

        {/* Tenant breakdown table */}
        <div className="bg-[#161b27] border border-[#252d40] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#252d40]">
            <h2 className="text-sm font-semibold text-slate-200">
              Per-Tenant Usage Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Current billing period
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252d40] bg-[#0f1117]/40">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">Organization</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">Plan</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">Interviews</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">Hours</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">Cost</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">ASR Provider</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">WER</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">DER</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-slate-500">Compliance</th>
              </tr>
            </thead>
            <tbody>
              {stats.tenantBreakdown.map((t, idx) => {
                const tenant = TENANTS.find((ten) => ten.id === t.tenantId);
                return (
                  <tr
                    key={t.tenantId}
                    className={`hover:bg-[#1a2030] transition-colors ${
                      idx < stats.tenantBreakdown.length - 1 ? "border-b border-[#252d40]" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: (tenant?.color ?? "#6366f1") + "20",
                            color: tenant?.color ?? "#6366f1",
                          }}
                        >
                          {tenant?.logoInitials}
                        </div>
                        <span className="text-sm font-medium text-slate-200">
                          {t.tenantName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={t.planTier === "enterprise" ? "primary" : "neutral"}
                        size="sm"
                      >
                        {t.planTier}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-slate-200">
                      {t.interviewsThisMonth}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-300">{t.hoursTranscribed}h</td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-200">
                      {formatCurrency(t.costThisMonth)}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400">{t.asrProvider}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-sm font-semibold ${
                          t.wer < 8 ? "text-emerald-400" : t.wer < 12 ? "text-amber-400" : "text-red-400"
                        }`}
                      >
                        {t.wer}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-sm font-semibold ${
                          t.der < 6 ? "text-emerald-400" : t.der < 10 ? "text-amber-400" : "text-red-400"
                        }`}
                      >
                        {t.der}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {t.complianceFlag ? (
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-amber-400" />
                          <Badge variant="warning" size="sm">POJK</Badge>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">Standard</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
