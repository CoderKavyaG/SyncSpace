"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspace";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      window.location.href = callbackUrl;
    } catch (err) {
      console.error("Login submit error:", err);
      setError("An unexpected error occurred. Please try again.");
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
          Log in to SyncSpace
        </h2>
        <p className="text-xs sm:text-sm text-[#626875] font-body">
          Enter your email and password to access your workspaces.
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#626875] font-display">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8F98]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] py-3 px-4 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-[#626875]">
        Don&apos;t have a SyncSpace account yet?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#0070F3] hover:underline underline-offset-4"
        >
          Create free account
        </Link>
      </div>
    </motion.div>
  );
}
