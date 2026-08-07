import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SyncSpaceLogo } from "@/components/ui/syncspace-logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] text-[#14171A] font-body flex flex-col justify-between items-center p-4 sm:p-8 antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Header Logo */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <SyncSpaceLogo size={32} className="group-hover:scale-105 transition-transform" />
          <span className="font-display font-bold text-lg tracking-tight text-[#14171A]">
            SyncSpace
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-[#626875] hover:text-[#14171A] transition-colors"
        >
          ← Back to home
        </Link>
      </header>

      {/* Main Centered Form Container */}
      <main className="w-full max-w-md my-auto py-8">
        <div className="rounded-2xl border border-[#E2E4E9] bg-white p-7 sm:p-9 shadow-xl ring-1 ring-black/5">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-[#8A8F98] font-mono">
        SyncSpace • Local-First Collaborative Engine • Yjs CRDTs
      </footer>
    </div>
  );
}
