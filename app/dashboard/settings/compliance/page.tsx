import React from "react";
import Header from "@/components/layout/Header";
import { AlertTriangle, Shield, Database, Globe } from "lucide-react";

export default function ComplianceSettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Compliance Settings" subtitle="Data residency and regulatory configuration" />

      {/* Phase 2 banner */}
      <div className="flex items-center gap-3 px-5 py-3 bg-[#FEF3E2] border-b border-[#B45309]/20 shrink-0">
        <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
        <p className="text-sm text-[#B45309] font-medium">
          Phase 2 — Compliance settings activate when your organization enables the POJK compliance flag.
        </p>
        <span className="ml-auto text-xs bg-[#FEF3E2] text-[#B45309] border border-[#B45309]/30 px-2 py-0.5 rounded font-medium">
          Phase 2
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 opacity-50 pointer-events-none">
        <div className="max-w-xl space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-[#0E5E6F]" />
              <h2 className="text-sm font-semibold text-neutral-900">Data Residency</h2>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Storage Region</label>
              <select className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm h-9 px-3">
                <option>Indonesia (Jakarta) — ap-southeast-3</option>
                <option>Singapore — ap-southeast-1</option>
              </select>
              <p className="text-xs text-neutral-400 mt-1.5">Data will be stored and processed only in the selected region.</p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-[#0E5E6F]" />
              <h2 className="text-sm font-semibold text-neutral-900">POJK Compliance</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <div>
                  <p className="text-sm text-neutral-700">Enable POJK compliance mode</p>
                  <p className="text-xs text-neutral-400">Activates enhanced audit logging and data controls</p>
                </div>
                <div className="w-9 h-5 rounded-full bg-neutral-200" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-neutral-700">PSE certification support</p>
                  <p className="text-xs text-neutral-400">Export compliance reports for PSE registration</p>
                </div>
                <div className="w-9 h-5 rounded-full bg-neutral-200" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-[#0E5E6F]" />
              <h2 className="text-sm font-semibold text-neutral-900">Cross-border Transfer</h2>
            </div>
            <p className="text-sm text-neutral-400">Control whether data can be transferred outside Indonesia for AI processing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
