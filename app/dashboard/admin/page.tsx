"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
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
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
} from "lucide-react";

// Simple bar chart using Tailwind
function BarChart({
  data,
  maxVal,
  color = "bg-[#0E5E6F]",
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
          <span className="text-[9px] text-neutral-400">{d.value}</span>
          <div
            className={`w-full ${color} rounded-t transition-all`}
            style={{
              height: `${((d.value / maxVal) * 100).toFixed(0)}%`,
              minHeight: "2px",
            }}
          />
          <span className="text-[9px] text-neutral-400 truncate max-w-full">
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

const TABS = ["Overview", "Usage", "ASR Health", "Alerts"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPage() {
  const stats = ADMIN_STATS;
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Admin Dashboard" subtitle="Platform-wide metrics and tenant usage" />

      {/* Tab bar */}
      <div className="flex items-center gap-0 px-6 pt-4 border-b border-neutral-200 bg-white shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab
                ? "border-[#0E5E6F] text-[#0E5E6F]"
                : "border-transparent text-neutral-400 hover:text-neutral-700",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* ── Overview tab ── */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* KPI grid */}
            <div className="grid grid-cols-4 gap-4">
              {[
                {
                  label: "Total Interviews",
                  value: stats.totalInterviews.toLocaleString(),
                  sub: `+${stats.interviewsThisWeek} this week`,
                  icon: <Mic className="w-5 h-5" />,
                  color: "text-[#0E5E6F]",
                  bg: "bg-[#E6F4F7]",
                  trend: "up",
                },
                {
                  label: "Hours Transcribed",
                  value: stats.totalHoursTranscribed.toString(),
                  sub: "All time",
                  icon: <Clock className="w-5 h-5" />,
                  color: "text-sky-600",
                  bg: "bg-sky-50",
                  trend: "up",
                },
                {
                  label: "Monthly Spend",
                  value: formatCurrency(stats.totalCostThisMonth),
                  sub: "All tenants",
                  icon: <DollarSign className="w-5 h-5" />,
                  color: "text-[#1A7F4B]",
                  bg: "bg-[#E8F5EE]",
                  trend: "up",
                },
                {
                  label: "Active Tenants",
                  value: stats.activeTenantsCount.toString(),
                  sub: "All active",
                  icon: <Users className="w-5 h-5" />,
                  color: "text-[#4338CA]",
                  bg: "bg-[#EEF2FF]",
                  trend: "neutral",
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="bg-white border border-neutral-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-neutral-400">{kpi.label}</p>
                    <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                      <span className={kpi.color}>{kpi.icon}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-[#1A7F4B]" />
                    ) : kpi.trend === "down" ? (
                      <TrendingDown className="w-3 h-3 text-[#C0392B]" />
                    ) : null}
                    <p className="text-xs text-neutral-400">{kpi.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-neutral-400" />
                  <h2 className="text-sm font-semibold text-neutral-700">Weekly Interviews</h2>
                </div>
                <BarChart
                  data={weeklyInterviews}
                  maxVal={Math.max(...weeklyInterviews.map((d) => d.value))}
                  color="bg-[#0E5E6F]"
                  height="h-24"
                />
                <p className="text-xs text-neutral-400 mt-3 text-center">
                  {stats.interviewsThisWeek} interviews this week
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <h2 className="text-sm font-semibold text-neutral-700">Monthly Transcription Hours</h2>
                  </div>
                  <Badge variant="success" size="sm">All Tenants</Badge>
                </div>
                <BarChart
                  data={monthlyHours}
                  maxVal={Math.max(...monthlyHours.map((d) => d.value))}
                  color="bg-sky-500"
                  height="h-24"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Usage tab ── */}
        {activeTab === "Usage" && (
          <div className="space-y-5">
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200">
                <h2 className="text-sm font-semibold text-neutral-700">Per-Tenant Usage Breakdown</h2>
                <p className="text-xs text-neutral-400">Current billing period</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/40">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Organization</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Plan</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Interviews</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Hours</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Cost</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">ASR Provider</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.tenantBreakdown.map((t, idx) => {
                    const tenant = TENANTS.find((ten) => ten.id === t.tenantId);
                    return (
                      <tr
                        key={t.tenantId}
                        className={`hover:bg-neutral-50 transition-colors ${
                          idx < stats.tenantBreakdown.length - 1 ? "border-b border-neutral-100" : ""
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
                            <span className="text-sm font-medium text-neutral-700">{t.tenantName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={t.planTier === "enterprise" ? "primary" : "neutral"} size="sm">
                            {t.planTier}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-neutral-700">{t.interviewsThisMonth}</td>
                        <td className="px-5 py-3 text-sm text-neutral-700">{t.hoursTranscribed}h</td>
                        <td className="px-5 py-3 text-sm font-semibold text-neutral-700">{formatCurrency(t.costThisMonth)}</td>
                        <td className="px-5 py-3 text-xs text-neutral-400">{t.asrProvider}</td>
                        <td className="px-5 py-3">
                          {t.complianceFlag ? (
                            <div className="flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-[#B45309]" />
                              <Badge variant="warning" size="sm">POJK</Badge>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400">Standard</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ASR Health tab ── */}
        {activeTab === "ASR Health" && (
          <div className="space-y-5">
            {/* Summary metrics */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#0E5E6F]" />
                <h2 className="text-sm font-semibold text-neutral-700">Quality Metrics Summary</h2>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Word Error Rate (WER) and Diarisation Error Rate (DER) across providers
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-400">Avg WER</span>
                    <Badge variant={stats.avgWER < 10 ? "success" : "warning"} size="sm">
                      {stats.avgWER}%
                    </Badge>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stats.avgWER < 10 ? "bg-[#1A7F4B]" : "bg-[#B45309]"}`}
                      style={{ width: `${Math.min(stats.avgWER * 3, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">Target: &lt;10%</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-400">Avg DER</span>
                    <Badge variant={stats.avgDER < 8 ? "success" : "warning"} size="sm">
                      {stats.avgDER}%
                    </Badge>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stats.avgDER < 8 ? "bg-[#1A7F4B]" : "bg-[#B45309]"}`}
                      style={{ width: `${Math.min(stats.avgDER * 5, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">Target: &lt;8%</p>
                </div>
              </div>
            </div>

            {/* Per-provider breakdown */}
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-neutral-700 mb-4">Per-Provider Breakdown</h2>
              <div className="space-y-4">
                {[
                  { provider: "Google STT", wer: 8.2, der: 5.1, color: "bg-sky-500", status: "healthy" },
                  { provider: "Azure Speech", wer: 6.7, der: 4.3, color: "bg-blue-500", status: "healthy" },
                  { provider: "Whisper Large v3", wer: 11.4, der: 7.8, color: "bg-[#4338CA]", status: "warning" },
                  { provider: "Deepgram Nova 2", wer: 7.9, der: 5.5, color: "bg-[#0E5E6F]", status: "healthy" },
                ].map((p) => (
                  <div key={p.provider} className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0">
                    <div className={`w-2 h-2 rounded-full ${p.color} shrink-0`} />
                    <span className="text-sm text-neutral-700 w-40 shrink-0">{p.provider}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-400 w-8">WER</span>
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.wer * 5}%` }} />
                        </div>
                        <span className="text-xs text-neutral-700 w-10 text-right">{p.wer}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-400 w-8">DER</span>
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className={`h-full ${p.color} rounded-full opacity-60`} style={{ width: `${p.der * 7}%` }} />
                        </div>
                        <span className="text-xs text-neutral-700 w-10 text-right">{p.der}%</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {p.status === "healthy" ? (
                        <div className="flex items-center gap-1 text-[#1A7F4B]">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Healthy</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[#B45309]">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">Warning</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-tenant WER/DER */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-neutral-200">
                <h2 className="text-sm font-semibold text-neutral-700">Tenant-Level Quality</h2>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/40">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">Organization</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">ASR Provider</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">WER</th>
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-neutral-400">DER</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.tenantBreakdown.map((t, idx) => (
                    <tr
                      key={t.tenantId}
                      className={`hover:bg-neutral-50 transition-colors ${
                        idx < stats.tenantBreakdown.length - 1 ? "border-b border-neutral-100" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-sm font-medium text-neutral-700">{t.tenantName}</td>
                      <td className="px-5 py-3 text-xs text-neutral-400">{t.asrProvider}</td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-semibold ${t.wer < 8 ? "text-[#1A7F4B]" : t.wer < 12 ? "text-[#B45309]" : "text-[#C0392B]"}`}>
                          {t.wer}%
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-semibold ${t.der < 6 ? "text-[#1A7F4B]" : t.der < 10 ? "text-[#B45309]" : "text-[#C0392B]"}`}>
                          {t.der}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Alerts tab ── */}
        {activeTab === "Alerts" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-700">System Alerts</h2>
              <Badge variant="warning" size="sm">3 active</Badge>
            </div>

            {[
              {
                level: "warning",
                title: "High WER on Whisper Large v3",
                description: "Word Error Rate has exceeded the 10% threshold for PT Nusantara Capital. Current WER: 11.4%.",
                time: "2 hours ago",
                tenant: "PT Nusantara Capital",
              },
              {
                level: "warning",
                title: "Approaching interview hour limit",
                description: "Mandiri Tech has used 34/50 interview hours (68%) this billing period.",
                time: "5 hours ago",
                tenant: "Mandiri Tech",
              },
              {
                level: "info",
                title: "POJK compliance flag enabled",
                description: "BRI Agro Fintech activated POJK compliance mode. Data residency controls are now enforced.",
                time: "1 day ago",
                tenant: "BRI Agro Fintech",
              },
              {
                level: "success",
                title: "ASR provider failover resolved",
                description: "Automatic failover from Google STT to Deepgram Nova 2 completed successfully.",
                time: "2 days ago",
                tenant: "System",
              },
              {
                level: "danger",
                title: "Transcript processing delay",
                description: "Interview transcript for candidate Dewi Sartika (ID: INT-0042) took >5 min to process.",
                time: "3 days ago",
                tenant: "Gojek HR",
              },
            ].map((alert, i) => (
              <div
                key={i}
                className={[
                  "bg-white border rounded-xl p-4 flex items-start gap-3",
                  alert.level === "danger" ? "border-[#C0392B]/30" : alert.level === "warning" ? "border-[#B45309]/30" : "border-neutral-200",
                ].join(" ")}
              >
                <div className="mt-0.5 shrink-0">
                  {alert.level === "success" && <CheckCircle className="w-4 h-4 text-[#1A7F4B]" />}
                  {alert.level === "warning" && <AlertTriangle className="w-4 h-4 text-[#B45309]" />}
                  {alert.level === "danger" && <XCircle className="w-4 h-4 text-[#C0392B]" />}
                  {alert.level === "info" && <Zap className="w-4 h-4 text-[#0E5E6F]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-neutral-800">{alert.title}</p>
                    <span className="text-xs text-neutral-400 shrink-0">{alert.time}</span>
                  </div>
                  <p className="text-xs text-neutral-500">{alert.description}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">{alert.tenant}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
