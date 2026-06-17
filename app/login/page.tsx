"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    setLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    // Accept any email + "password" → redirect to dashboard
    if (password === "password" || password.length >= 4) {
      router.push("/dashboard");
    } else {
      setError("Password minimal 4 karakter.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-100">Shannon Scout</p>
            <p className="text-xs text-slate-500">AI Recruitment Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#161b27] border border-[#252d40] rounded-2xl p-7 shadow-2xl">
          <h1 className="text-xl font-bold text-slate-100 mb-1">Sign in</h1>
          <p className="text-sm text-slate-500 mb-6">
            Welcome back. Enter your credentials to continue.
          </p>

          {error && (
            <div className="mb-4 px-3 py-2.5 bg-red-600/10 border border-red-600/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 placeholder-slate-600 rounded-lg text-sm py-2.5 pl-9 pr-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#0f1117] border border-[#252d40] text-slate-100 placeholder-slate-600 rounded-lg text-sm py-2.5 pl-9 pr-9 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-indigo-600 rounded"
                />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 px-4 py-3 bg-[#161b27]/50 border border-[#252d40] rounded-xl">
          <p className="text-xs text-slate-500 text-center">
            <span className="text-slate-400 font-medium">Demo mode:</span> use any email + any password (min 4 chars)
          </p>
        </div>
      </div>
    </div>
  );
}
