"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import { Save } from "lucide-react";

export default function OrgSettingsPage() {
  const [form, setForm] = useState({
    orgName: "Mandiri Tech",
    industry: "fintech",
    complianceTier: "general",
    retentionMonths: "24",
  });
  const { toasts, showToast, removeToast } = useToast();

  const handleSave = () => {
    showToast("Organization settings saved", "success");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Org Settings" subtitle="Manage your organization configuration" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl space-y-6">
          {/* Basic info */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Organization Details</h2>
            <div className="space-y-4">
              <Input
                label="Organization Name"
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              />
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Industry</label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm h-9 px-3 focus:outline-none focus:border-[#0E5E6F] focus:ring-1 focus:ring-[rgba(14,94,111,0.12)]"
                >
                  <option value="fintech">FinTech / Finance</option>
                  <option value="banking">Banking</option>
                  <option value="tech">Technology</option>
                  <option value="hr">HR / Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Compliance tier */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-neutral-900 mb-1">Compliance Tier</h2>
            <p className="text-xs text-neutral-400 mb-4">Choose the compliance framework that applies to your organization.</p>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="compliance"
                  value="general"
                  checked={form.complianceTier === "general"}
                  onChange={() => setForm({ ...form, complianceTier: "general" })}
                  className="mt-0.5 accent-[#0E5E6F]"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-700">General</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Standard data handling, no special regulatory requirements.</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="compliance"
                  value="pojk"
                  checked={form.complianceTier === "pojk"}
                  onChange={() => setForm({ ...form, complianceTier: "pojk" })}
                  className="mt-0.5 accent-[#0E5E6F]"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-700">POJK (OJK Regulated)</p>
                  <p className="text-xs text-neutral-400 mt-0.5">For organizations regulated by OJK. Enables data residency controls, PSE certification support, and enhanced audit logging.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Retention policy */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Data Retention</h2>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Retain recordings & transcripts for</label>
              <select
                value={form.retentionMonths}
                onChange={(e) => setForm({ ...form, retentionMonths: e.target.value })}
                className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm h-9 px-3 focus:outline-none focus:border-[#0E5E6F] focus:ring-1 focus:ring-[rgba(14,94,111,0.12)]"
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months (max)</option>
              </select>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleSave}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
