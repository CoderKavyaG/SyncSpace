"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User as UserIcon, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*()]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!hasMinLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call Signup API endpoint
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // 2. Automatically log in after account creation
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("Account created, but auto-login failed. Please sign in manually.");
        setIsLoading(false);
        window.location.href = "/login";
        return;
      }

      window.location.href = "/onboarding";
    } catch (err) {
      console.error("Signup submit error:", err);
      setError("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full space-y-6"
    >
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-[#14171A] font-display sm:text-3xl">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-[#626875] font-body">
          Set up your profile and launch your local-first workspace.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#626875] mb-1.5 font-display">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-[#E2E4E9] bg-white py-2.5 pl-10 pr-4 text-sm text-[#14171A] placeholder:text-[#8A8F98]/60 focus:border-[#0070F3] focus:outline-none focus:ring-2 focus:ring-[#0070F3]/20 transition-all disabled:opacity-50 font-body"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#626875] mb-1.5 font-display">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@workspace.io"
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-[#E2E4E9] bg-white py-2.5 pl-10 pr-4 text-sm text-[#14171A] placeholder:text-[#8A8F98]/60 focus:border-[#0070F3] focus:outline-none focus:ring-2 focus:ring-[#0070F3]/20 transition-all disabled:opacity-50 font-body"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#626875] mb-1.5 font-display">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              disabled={isLoading}
              className="w-full rounded-xl border border-[#E2E4E9] bg-white py-2.5 pl-10 pr-10 text-sm text-[#14171A] placeholder:text-[#8A8F98]/60 focus:border-[#0070F3] focus:outline-none focus:ring-2 focus:ring-[#0070F3]/20 transition-all disabled:opacity-50 font-body"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8F98] hover:text-[#14171A] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Validation Hints */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1 text-xs">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600" : "text-[#8A8F98]"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? "text-emerald-600" : "text-[#8A8F98]"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Contains a number or special character</span>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] py-3 px-4 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account & Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-[#626875]">
        Already have a SyncSpace account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#0070F3] hover:underline underline-offset-4"
        >
          Log in
        </Link>
      </div>
    </motion.div>
  );
}
