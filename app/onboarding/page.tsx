"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, CheckCircle, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const STEPS = [
  { id: 1, label: "Org Details" },
  { id: 2, label: "Compliance Tier" },
  { id: 3, label: "Invite Team" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("fintech");
  const [complianceTier, setComplianceTier] = useState("general");
  const [invites, setInvites] = useState([{ email: "", role: "Recruiter" }]);
  const [loading, setLoading] = useState(false);

  const addInvite = () => setInvites((prev) => [...prev, { email: "", role: "Recruiter" }]);
  const removeInvite = (i: number) => setInvites((prev) => prev.filter((_, idx) => idx !== i));
  const updateInvite = (i: number, field: string, value: string) => {
    setInvites((prev) => prev.map((inv, idx) => idx === i ? { ...inv, [field]: value } : inv));
  };

  const handleFinish = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0E5E6F] rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <p className="text-lg font-bold text-neutral-900">Shannon Scout</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                    step > s.id
                      ? "bg-[#1A7F4B] border-[#1A7F4B] text-white"
                      : step === s.id
                      ? "bg-[#0E5E6F] border-[#0E5E6F] text-white"
                      : "bg-white border-neutral-200 text-neutral-400",
                  ].join(" ")}
                >
                  {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                </div>
                <p className={`text-[10px] mt-1 ${step === s.id ? "text-[#0E5E6F] font-medium" : "text-neutral-400"}`}>
                  {s.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-16 mb-4 mx-1 ${step > s.id + 1 || (step > s.id) ? "bg-[#1A7F4B]" : "bg-neutral-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-7 shadow-sm">
          {/* Step 1: Org Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-1">Set up your organization</h2>
                <p className="text-sm text-neutral-400">Tell us about your company.</p>
              </div>
              <Input
                label="Organization Name"
                placeholder="PT Mandiri Teknologi"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm h-9 px-3 focus:outline-none focus:border-[#0E5E6F]"
                >
                  <option value="fintech">FinTech / Finance</option>
                  <option value="banking">Banking</option>
                  <option value="tech">Technology</option>
                  <option value="hr">HR / Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Compliance Tier */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-1">Choose compliance tier</h2>
                <p className="text-sm text-neutral-400">Select the regulatory framework that applies.</p>
              </div>
              <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="tier"
                  value="general"
                  checked={complianceTier === "general"}
                  onChange={() => setComplianceTier("general")}
                  className="mt-0.5 accent-[#0E5E6F]"
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">General</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Standard compliance. Suitable for most technology and HR companies. Data may be processed in regional cloud infrastructure.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="tier"
                  value="pojk"
                  checked={complianceTier === "pojk"}
                  onChange={() => setComplianceTier("pojk")}
                  className="mt-0.5 accent-[#0E5E6F]"
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">POJK (OJK Regulated)</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    For financial institutions regulated by OJK (Otoritas Jasa Keuangan). Enables strict data residency within Indonesia, PSE certification support, enhanced audit logging, and cross-border transfer controls required by POJK regulations.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] bg-[#FEF3E2] text-[#B45309] px-2 py-0.5 rounded font-medium">
                    Requires Phase 2 activation
                  </div>
                </div>
              </label>
            </div>
          )}

          {/* Step 3: Invite Team */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-1">Invite your team</h2>
                <p className="text-sm text-neutral-400">Add team members to your workspace. You can skip this step.</p>
              </div>
              <div className="space-y-2">
                {invites.map((inv, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder="colleague@company.com"
                      value={inv.email}
                      onChange={(e) => updateInvite(i, "email", e.target.value)}
                      className="flex-1 bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-lg text-sm h-9 px-3 focus:outline-none focus:border-[#0E5E6F]"
                    />
                    <select
                      value={inv.role}
                      onChange={(e) => updateInvite(i, "role", e.target.value)}
                      className="w-32 bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm h-9 px-2 focus:outline-none focus:border-[#0E5E6F]"
                    >
                      <option>Admin</option>
                      <option>Recruiter</option>
                      <option>Interviewer</option>
                      <option>Viewer</option>
                    </select>
                    {invites.length > 1 && (
                      <button
                        onClick={() => removeInvite(i)}
                        className="p-2 text-neutral-400 hover:text-[#C0392B] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addInvite}
                className="flex items-center gap-1.5 text-sm text-[#0E5E6F] hover:text-[#09414D] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add another
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className={`mt-6 flex ${step === 1 ? "justify-end" : "justify-between"}`}>
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={() => setStep((s) => s + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                loading={loading}
                onClick={handleFinish}
              >
                {loading ? "Setting up..." : "Go to Dashboard"}
              </Button>
            )}
          </div>
        </div>

        {step === 3 && (
          <p className="mt-4 text-center text-xs text-neutral-400">
            <button
              onClick={handleFinish}
              className="text-[#0E5E6F] hover:underline"
            >
              Skip for now
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
