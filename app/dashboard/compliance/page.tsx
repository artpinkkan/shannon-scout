import React from "react";
import Header from "@/components/layout/Header";
import { Shield, Lock, FileCheck, Database, Globe, AlertTriangle } from "lucide-react";

function Phase2Banner() {
  return (
    <div className="flex items-center gap-3 px-5 py-3 bg-amber-600/10 border border-amber-600/30">
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
      <p className="text-sm text-amber-400 font-medium">
        Phase 2 — available after compliance trigger.{" "}
        <span className="text-amber-500/80 font-normal">
          This module activates when your organization enables the POJK compliance flag.
        </span>
      </p>
      <span className="ml-auto text-xs bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded font-medium">
        Phase 2
      </span>
    </div>
  );
}

export default function CompliancePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Compliance & Data Residency" />

      <Phase2Banner />

      <div className="flex-1 overflow-y-auto p-6 opacity-50 pointer-events-none">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-100">Compliance & Data Residency</h1>
          <p className="text-sm text-slate-500 mt-1">
            POJK-compliant data handling, residency controls, and audit trails
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              icon: <Shield className="w-6 h-6 text-amber-400" />,
              title: "POJK Compliance",
              desc: "OJK Circular Letter No. 14/SEOJK.07/2014 adherence",
              status: "Pending activation",
            },
            {
              icon: <Database className="w-6 h-6 text-sky-400" />,
              title: "Data Residency",
              desc: "All data stored within Indonesian data centers (AWS Jakarta)",
              status: "Ready to enable",
            },
            {
              icon: <FileCheck className="w-6 h-6 text-emerald-400" />,
              title: "Audit Trail",
              desc: "Full immutable log of all transcript access and modifications",
              status: "Configured",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#161b27] border border-[#252d40] rounded-xl p-5"
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.desc}</p>
              <p className="text-xs text-amber-400 mt-2">{item.status}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">Data Retention Policy</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Interview recordings", value: "90 days", locked: true },
                { label: "Transcripts", value: "365 days", locked: true },
                { label: "AI summaries", value: "365 days", locked: false },
                { label: "Audit logs", value: "Permanent", locked: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-[#252d40]"
                >
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-200">{item.value}</span>
                    {item.locked && <Lock className="w-3 h-3 text-amber-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161b27] border border-[#252d40] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">Data Residency Map</h2>
            </div>
            <div className="h-32 bg-[#0f1117] rounded-lg border border-[#252d40] flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Indonesia region map</p>
                <p className="text-[10px] text-slate-700">AWS ap-southeast-3 (Jakarta)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
