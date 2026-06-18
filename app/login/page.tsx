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

    // Accept any email + any password (min 4 chars)
    if (password.length >= 4) {
      localStorage.setItem("shannon_session", JSON.stringify({ email }));
      router.push("/dashboard");
    } else {
      setError("Password minimal 4 karakter.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[480px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0E5E6F] rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-neutral-900">Shannon Scout</p>
            <p className="text-xs text-neutral-400">AI Recruitment Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-7 shadow-sm">
          <h1 className="text-xl font-bold text-neutral-900 mb-1">Sign in</h1>
          <p className="text-sm text-neutral-400 mb-6">
            Welcome back. Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-lg text-sm h-9 pl-9 pr-3 focus:outline-none focus:border-[#0E5E6F] focus:ring-1 focus:ring-[rgba(14,94,111,0.12)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 rounded-lg text-sm h-9 pl-9 pr-9 focus:outline-none focus:border-[#0E5E6F] focus:ring-1 focus:ring-[rgba(14,94,111,0.12)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Inline error */}
            {error && (
              <p className="text-xs text-[#C0392B]">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded accent-[#0E5E6F]"
                />
                <span className="text-xs text-neutral-400">Remember me</span>
              </label>
              <a href="#" className="text-xs text-[#0E5E6F] hover:text-[#09414D]">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0E5E6F] hover:bg-[#09414D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium h-9 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
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

          <p className="mt-5 text-center text-xs text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[#0E5E6F] hover:text-[#09414D]"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 px-4 py-3 bg-white border border-neutral-200 rounded-xl">
          <p className="text-xs text-neutral-400 text-center">
            <span className="text-neutral-700 font-medium">Demo mode:</span> use any email + any password (min 4 chars)
          </p>
        </div>
      </div>
    </div>
  );
}
