"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, User, Mail, Lock, Building2 } from "lucide-react";
import Link from "next/link";
import Select from "@/components/ui/Select";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Recruiter",
    orgName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center px-4">
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-100">Shannon Scout</p>
            <p className="text-xs text-slate-500">AI Recruitment Platform</p>
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#252d40] rounded-2xl p-7 shadow-2xl">
          <h1 className="text-xl font-bold text-slate-100 mb-1">Create account</h1>
          <p className="text-sm text-slate-500 mb-6">
            Set up your organization&apos;s recruitment workspace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Sari Dewi Kusuma"
                  className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 placeholder-slate-600 rounded-lg text-sm py-2.5 pl-9 pr-3 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="sari@company.co.id"
                  className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 placeholder-slate-600 rounded-lg text-sm py-2.5 pl-9 pr-3 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={form.orgName}
                  onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                  placeholder="PT Mandiri Teknologi"
                  className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 placeholder-slate-600 rounded-lg text-sm py-2.5 pl-9 pr-3 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full appearance-none bg-[#0f1117] border border-[#252d40] text-slate-100 rounded-lg text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Admin">Admin</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Interviewer">Interviewer</option>
                <option value="Candidate">Candidate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 placeholder-slate-600 rounded-lg text-sm py-2.5 pl-9 pr-3 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
