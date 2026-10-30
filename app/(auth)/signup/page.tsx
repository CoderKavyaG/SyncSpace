"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User as UserIcon, AlertCircle } from "lucide-react";

function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const hasMinLength = password.length >= 8;

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      await signIn("google", { callbackUrl: "/workspace" });
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError("Failed to sign up with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

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

      window.location.href = "/workspace";
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
          Launch your local-first workspace with Google in seconds.
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

      {/* 1. PRIMARY GOOGLE 1-CLICK SIGN UP */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading || isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#E2E4E9] bg-white py-3 px-4 text-sm font-semibold text-[#14171A] hover:bg-[#F7F8FA] hover:border-[#D1D5DB] shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#0070F3]" />
            <span>Setting up with Google...</span>
          </>
        ) : (
          <>
            <GoogleLogo className="w-4 h-4" />
            <span>Sign up with Google</span>
          </>
        )}
      </button>

      {/* DIVIDER */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E2E4E9]" />
        </div>
        <div className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-[#8A8F98]">
          or register with email
        </div>
      </div>

      {/* 2. REGISTRATION FORM */}
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
              placeholder="Alex Chen"
              required
              disabled={isLoading || isGoogleLoading}
              className="w-full rounded-xl border border-[#E2E4E9] bg-white py-2.5 pl-10 pr-4 text-sm text-[#14171A] placeholder:text-[#8A8F98]/60 focus:border-[#0070F3] focus:outline-none focus:ring-2 focus:ring-[#0070F3]/20 transition-all disabled:opacity-50 font-body"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#626875] mb-1.5 font-display">
            Work or Personal Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@workspace.io"
              required
              disabled={isLoading || isGoogleLoading}
              className="w-full rounded-xl border border-[#E2E4E9] bg-white py-2.5 pl-10 pr-4 text-sm text-[#14171A] placeholder:text-[#8A8F98]/60 focus:border-[#0070F3] focus:outline-none focus:ring-2 focus:ring-[#0070F3]/20 transition-all disabled:opacity-50 font-body"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#626875] mb-1.5 font-display">
            Password (min. 8 characters)
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || isGoogleLoading}
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
        </div>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] py-3 px-4 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating your workspace...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-[#626875]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#0070F3] hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
