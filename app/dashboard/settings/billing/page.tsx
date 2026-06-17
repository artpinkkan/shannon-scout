import React from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CreditCard, TrendingUp, Mic } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Billing & Usage" subtitle="Current plan and usage metrics" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl space-y-5">
          {/* Current plan */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Current Plan</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Billed monthly</p>
              </div>
              <Badge variant="primary" size="sm">Growth</Badge>
            </div>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-3xl font-bold text-neutral-900">Rp 4.500.000</span>
              <span className="text-sm text-neutral-400 mb-1">/month</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              {[
                { label: "Interview Hours", value: "50h", limit: "50h" },
                { label: "Seats", value: "10", limit: "10" },
                { label: "Storage", value: "100 GB", limit: "100 GB" },
              ].map((item) => (
                <div key={item.label} className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-400">{item.label}</p>
                  <p className="text-sm font-semibold text-neutral-700 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" fullWidth leftIcon={<CreditCard className="w-4 h-4" />}>
              Upgrade Plan
            </Button>
          </div>

          {/* Usage meters */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#0E5E6F]" />
              <h2 className="text-sm font-semibold text-neutral-900">This Month&apos;s Usage</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: "Interview Hours", used: 34, total: 50, unit: "h" },
                { label: "Transcription Minutes", used: 2040, total: 3000, unit: " min" },
                { label: "Storage", used: 67, total: 100, unit: " GB" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-neutral-700">{item.label}</span>
                    <span className="text-xs text-neutral-400">
                      {item.used}{item.unit} / {item.total}{item.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0E5E6F] rounded-full"
                      style={{ width: `${(item.used / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost estimate */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Mic className="w-4 h-4 text-[#0E5E6F]" />
              <h2 className="text-sm font-semibold text-neutral-900">ASR Cost Estimate</h2>
            </div>
            <p className="text-xs text-neutral-400 mb-3">Based on current month usage</p>
            <div className="space-y-2">
              {[
                { label: "Whisper Large v3", hours: "20h", cost: "Rp 850.000" },
                { label: "Deepgram Nova 2", hours: "14h", cost: "Rp 620.000" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-neutral-700">{row.label}</p>
                    <p className="text-[10px] text-neutral-400">{row.hours} transcribed</p>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">{row.cost}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-700">Estimated Total</p>
              <p className="text-lg font-bold text-neutral-900">Rp 1.470.000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
