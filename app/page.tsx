import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Zap,
  ShieldCheck,
  ArrowRight,
  GitMerge,
  MousePointer2,
  FileText,
  Search,
  HardDrive,
  Globe,
  Terminal,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Mic,
  ChevronRight,
  Layers,
  Inbox,
  HelpCircle,
  Code2,
  CheckSquare,
  ChevronDown,
  MessageSquare,
  Box,
} from "lucide-react";
import { SyncSpaceLogo } from "@/components/ui/syncspace-logo";
import { NotionAvatarStack, NotionFlyingBook, NotionAssistantMascot } from "@/components/ui/notion-doodles";
import { InstagramIcon, TwitterXIcon, LinkedInIcon, GitHubIcon, YouTubeIcon } from "@/components/ui/social-icons";
import { BrandLogosGrid } from "@/components/ui/brand-logos";

export default async function LandingPage() {
  const session = await auth();

  // If user is already authenticated, redirect to workspace directly
  if (session?.user) {
    redirect("/workspace");
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] text-[#14171A] font-body selection:bg-primary/20 selection:text-primary antialiased overflow-x-hidden">
      {/* 1. TOP NAVIGATION (Notion Light Grade) */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E2E4E9] bg-[#FAF9F6]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo & Brand with Notion-Style Isometric S */}
          <Link href="/" className="flex items-center gap-3 group">
            <SyncSpaceLogo size={32} className="group-hover:scale-105 transition-transform" />
            <span className="font-display font-bold text-lg tracking-tight text-[#14171A]">
              SyncSpace
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#626875]">
            <a href="#features" className="hover:text-[#14171A] transition-colors">
              Product
            </a>
            <a href="#local-first" className="hover:text-[#14171A] transition-colors">
              Local-First Engine
            </a>
            <a href="#workflows" className="hover:text-[#14171A] transition-colors">
              Workflows
            </a>
            <a href="#teams" className="hover:text-[#14171A] transition-colors">
              Founders & Teams
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#626875] hover:text-[#14171A] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <span>Create account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION (Notion Light Style with Illustrated Doodles) */}
      <section className="relative pt-14 pb-14 sm:pt-20 sm:pb-20 px-4 sm:px-8 text-center max-w-5xl mx-auto">
        {/* Floating Flying Book Doodle Mascot */}
        <div className="flex justify-center mb-5">
          <NotionFlyingBook />
        </div>

        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary mb-6 shadow-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>Local-First Architecture • 0ms Keystroke Latency • Yjs CRDTs</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#14171A] font-display leading-[1.08] max-w-4xl mx-auto">
          Where modern teams <br className="hidden sm:inline" />
          <span className="text-[#0070F3] underline decoration-[#0070F3]/30 decoration-wavy underline-offset-8">
            write & sync together.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-[#626875] max-w-2xl mx-auto font-normal leading-relaxed">
          The next-generation collaborative workspace. Built with client-side IndexedDB persistence,
          zero-latency local typing, and real-time conflict-free CRDT synchronization.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] px-6 py-3.5 text-sm font-semibold text-white shadow-xl transition-all active:scale-[0.98]"
          >
            <span>Create account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#E2E4E9] bg-white px-6 py-3.5 text-sm font-semibold text-[#14171A] hover:bg-[#F4F5F7] hover:border-[#D0D4DC] shadow-xs transition-all"
          >
            <span>Log in</span>
          </Link>
        </div>

        {/* Notion-Style Illustrated Face Avatar Stack */}
        <div className="mt-12 flex justify-center">
          <NotionAvatarStack />
        </div>

        {/* Comprehensive 2-Row Brand Logos Grid (Image 2 Match) */}
        <div className="mt-12 pt-8 border-t border-[#E2E4E9]">
          <BrandLogosGrid />
        </div>
      </section>

      {/* 3. HERO INTERACTIVE WORKSPACE MOCKUP (Light Clean Canvas) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <div className="relative rounded-2xl border border-[#E2E4E9] bg-white shadow-2xl overflow-hidden ring-1 ring-black/5">
          {/* Top Window Chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E4E9] bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              <span className="ml-3 text-xs font-mono text-[#626875]">
                SyncSpace — Engineering Roadmap (Live Collaboration)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Synced</span>
              </div>
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-[#0070F3] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  IK
                </div>
                <div className="w-6 h-6 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  KG
                </div>
                <div className="w-6 h-6 rounded-full bg-amber-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                  AN
                </div>
              </div>
            </div>
          </div>

          {/* App Body Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[460px]">
            {/* Sidebar Mockup */}
            <div className="border-r border-[#E2E4E9] bg-[#F7F6F3] p-4 space-y-3 hidden md:block text-xs">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E4E9] font-semibold text-[#14171A] font-display shadow-xs">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                  S
                </div>
                <span>DevLearn Studio</span>
              </div>
              <div className="pt-2 text-[10px] font-semibold uppercase text-[#8A8F98] tracking-wider px-2 font-display">
                Workspace Pages
              </div>
              <div className="space-y-1 text-[#626875]">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E4E9] text-[#14171A] font-semibold shadow-xs">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Product Roadmap & OKRs</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/80 hover:text-[#14171A] transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Technical Design Review</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/80 hover:text-[#14171A] transition-colors">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Weekly Engineering Sync</span>
                </div>
              </div>
            </div>

            {/* Editor Canvas Mockup */}
            <div className="md:col-span-3 p-8 bg-white space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#14171A]">
                  Product Roadmap & Architecture
                </h2>
                <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs text-primary font-medium">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Local-First Mode: Edits save to IndexedDB instantly and sync live over WebSockets.</span>
                </div>
              </div>

              {/* Collaborative Remote Caret Simulation */}
              <div className="space-y-3 text-sm text-[#454A54] leading-relaxed relative">
                <p>
                  SyncSpace solves distributed collaborative editing by coupling{" "}
                  <span className="text-[#14171A] font-semibold">Yjs state vectors</span> with local IndexedDB
                  storage. Edits execute locally in 0 milliseconds, and merge with remote peers
                  without merge conflicts.
                </p>

                {/* Simulated Figma Cursors */}
                <div className="relative p-4 rounded-xl border border-[#E2E4E9] bg-[#FAF9F6] space-y-2">
                  <div className="text-xs font-semibold uppercase text-[#14171A] font-display">
                    Active Sprint Objectives
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#14171A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Zero-latency typing pipeline with ProseMirror transactions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#14171A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Automatic state reconnection & exponential backoff relay</span>
                  </div>

                  {/* Remote Caret 1 */}
                  <div className="absolute right-12 top-6 flex items-center gap-1">
                    <MousePointer2 className="w-4 h-4 text-primary fill-primary -rotate-12" />
                    <span className="bg-primary text-[10px] text-white px-1.5 py-0.5 rounded font-mono font-bold shadow-md">
                      Kavya Goel
                    </span>
                  </div>
                </div>

                {/* Slash Command Palette Simulation */}
                <div className="w-64 rounded-xl border border-[#E2E4E9] bg-white p-2 shadow-xl space-y-1">
                  <div className="px-2 py-1 text-[10px] font-semibold text-[#8A8F98] uppercase font-display">
                    Slash Commands
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                    <span className="w-4 h-4 flex items-center justify-center font-bold text-xs font-mono">H1</span>
                    <span>Heading 1</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#14171A] text-xs hover:bg-[#F4F5F7]">
                    <span className="w-4 h-4 flex items-center justify-center font-bold text-xs font-mono">[]</span>
                    <span>To-do Task List</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IN-DEPTH SPOTLIGHT SECTION (Image 1 Reference) */}
      <section id="local-first" className="py-20 border-t border-[#E2E4E9] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          {/* Section Header */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#14171A] font-display">
              Local-First where your team works.
            </h2>
            <p className="text-base sm:text-lg text-[#626875] max-w-2xl">
              Built for high-velocity writing, instant offline resilience, and zero-conflict collaboration.
            </p>
          </div>

          {/* Two In-Depth Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Capture Knowledge */}
            <div className="rounded-3xl border border-[#E2E4E9] bg-[#FAF9F6] p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-primary font-display">
                  Capture knowledge
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#14171A] font-display flex items-center justify-between">
                  <span>Bring everything into one system of record.</span>
                  <ChevronRight className="w-5 h-5 text-[#8A8F98]" />
                </h3>
              </div>

              {/* Interactive Mock Content Inside Card 1 */}
              <div className="rounded-2xl border border-[#E2E4E9] bg-white p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E2E4E9] pb-3">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-[#14171A] font-display">Meetings & Specs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8A8F98]">
                    <span>EPD syncs</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] border border-[#E2E4E9]">
                    <div className="flex items-center gap-2 text-[#14171A] font-medium">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span>Technical Design Review</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                        Growth
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">
                        Infra
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#FAF9F6] transition-colors">
                    <div className="flex items-center gap-2 text-[#626875]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Sprint Planning & Architecture</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[10px]">
                      Product Ops
                    </span>
                  </div>
                </div>

                {/* Simulated Audio/Waveform Recording Bar */}
                <div className="flex items-center justify-between rounded-xl bg-[#F4F5F7] px-3.5 py-2 text-xs text-[#626875]">
                  <span>Technical Design Review Summary</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-primary rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-primary rounded-full animate-pulse" />
                    <span className="w-1 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-primary rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Find Answers & Local CRDTs */}
            <div className="rounded-3xl border border-[#E2E4E9] bg-[#FAF9F6] p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-secondary font-display">
                  Local-First Velocity
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#14171A] font-display flex items-center justify-between">
                  <span>Get answers, instantly—with conflict-free sync.</span>
                  <ChevronRight className="w-5 h-5 text-[#8A8F98]" />
                </h3>
              </div>

              {/* Interactive Mock Content Inside Card 2 */}
              <div className="rounded-2xl border border-[#E2E4E9] bg-white p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E2E4E9] pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-[#14171A] font-display">Q3 System Metrics</span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                    <span>Syncing</span>
                  </div>
                </div>

                {/* Mini Metric Bars */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E2E4E9]">
                    <div className="text-xl font-bold text-[#14171A] font-display">0ms</div>
                    <div className="text-[10px] text-[#626875] font-mono">Keystroke Latency</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E2E4E9]">
                    <div className="text-xl font-bold text-emerald-600 font-display">100%</div>
                    <div className="text-[10px] text-[#626875] font-mono">Offline Uptime</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E2E4E9]">
                    <div className="text-xl font-bold text-primary font-display">0</div>
                    <div className="text-[10px] text-[#626875] font-mono">Merge Conflicts</div>
                  </div>
                </div>

                {/* Instant Prompt Search Bar */}
                <div className="flex items-center justify-between rounded-xl border border-[#E2E4E9] bg-[#FAF9F6] px-3 py-2 text-xs text-[#14171A]">
                  <span>Search pages and docs across workspace...</span>
                  <kbd className="rounded border border-[#E2E4E9] bg-white px-1.5 text-[10px] font-mono text-[#626875]">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKFLOWS & WORKSPACE AGENT SECTION (Image 5 Reference) */}
      <section id="workflows" className="py-20 border-t border-[#E2E4E9] bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          {/* Top Banner Card */}
          <div className="rounded-3xl border border-[#E2E4E9] bg-white p-8 sm:p-12 shadow-sm space-y-8">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0070F3] font-display">
                Automate busywork
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#14171A] font-display">
                Keep work moving 24/7 with local-first sync.
              </h2>
            </div>

            {/* Task Board & Assistant Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Task Board */}
              <div className="md:col-span-7 rounded-2xl border border-[#E2E4E9] bg-[#FAF9F6] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-[#14171A] font-display">Engineering Tasks</span>
                  </div>
                  <span className="text-xs text-[#8A8F98]">All issues</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* New Column */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#626875]">
                      <span>● New</span>
                      <span>2</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E2E4E9] shadow-xs space-y-1.5">
                      <div className="font-semibold text-[#14171A]">Fix wrap on H1 editor</div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold">
                        High priority
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E2E4E9] shadow-xs space-y-1.5">
                      <div className="font-semibold text-[#14171A]">Animation micro-interactions</div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Low priority
                      </span>
                    </div>
                  </div>

                  {/* In Progress Column */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#626875]">
                      <span>● In progress</span>
                      <span>2</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E2E4E9] shadow-xs space-y-1.5">
                      <div className="font-semibold text-[#14171A]">CRDT Vector Clock Handshake</div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">
                        Medium priority
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-[#E2E4E9] shadow-xs space-y-1.5">
                      <div className="font-semibold text-[#14171A]">IndexedDB blob caching</div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                        Medium priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SyncSpace Assistant Card with Notion Robot Mascot */}
              <div className="md:col-span-5 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <NotionAssistantMascot />
                  <div>
                    <div className="text-sm font-bold text-[#14171A] font-display">SyncSpace Assistant</div>
                    <div className="text-[11px] text-[#626875]">Local-first document intelligence</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-amber-200 text-xs text-[#454A54] leading-relaxed shadow-xs">
                  &ldquo;I looked at what&apos;s in flight in <strong>Engineering Tasks</strong> and drafted updates across 3 subpages. Ready to sync when you are.&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* 5 Bottom Category Cards (Image 5 Reference) */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8A8F98] font-display">
              See what SyncSpace can do
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="rounded-2xl border border-[#E2E4E9] bg-white p-4 space-y-3 hover:border-[#0070F3] hover:shadow-md transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0070F3] flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#14171A] font-display">
                  Triage product roadmaps →
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E4E9] bg-white p-4 space-y-3 hover:border-[#0070F3] hover:shadow-md transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#14171A] font-display">
                  Resolve team blocker threads →
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E4E9] bg-white p-4 space-y-3 hover:border-[#0070F3] hover:shadow-md transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#14171A] font-display">
                  Zero-latency security docs →
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E4E9] bg-white p-4 space-y-3 hover:border-[#0070F3] hover:shadow-md transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#14171A] font-display">
                  Automate weekly reporting →
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E4E9] bg-white p-4 space-y-3 hover:border-[#0070F3] hover:shadow-md transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#14171A] font-display">
                  Build local-first tools →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUSTED BY FOUNDERS & TEAMS THAT SHIP (Image 1 Reference with Duotone Portraits & Real Photos) */}
      <section id="teams" className="py-20 border-t border-[#E2E4E9] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          {/* Section Header */}
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#14171A] font-display">
              Trusted by teams that ship.
            </h2>
            <p className="text-base text-[#626875]">
              High-velocity software teams and creators rely on SyncSpace to document, plan, and collaborate without friction.
            </p>
          </div>

          {/* 3 Duotone Testimonial Cards with Image Backgrounds & Logotypes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Ishan Kumar - iNtheBox */}
            <div className="relative rounded-3xl overflow-hidden text-white shadow-xl min-h-[460px] flex flex-col justify-between p-7 sm:p-8 group bg-[#3B0D0C]">
              {/* Background Photo with Red Duotone Gradient Scrim */}
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: "url('https://ishankumax.vercel.app/profile.jpeg')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#200505] via-[#4A100E]/70 to-[#6E1815]/60" />

              {/* Company Logo at Top */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-white">
                  <Box className="w-5 h-5 text-red-300" />
                  <span className="font-display font-extrabold text-lg tracking-tight">iNtheBox</span>
                </div>
              </div>

              {/* Quote & Author Info at Bottom */}
              <div className="relative z-10 space-y-4 pt-24">
                <blockquote className="text-sm sm:text-base font-medium leading-relaxed text-zinc-100">
                  &ldquo;Using the most local-first native tools like SyncSpace is an essential competitive advantage for us to stay small while shipping at immense speed.&rdquo;
                </blockquote>
                <div className="pt-3 border-t border-white/20">
                  <div className="font-bold text-white font-display text-sm">Ishan Kumar</div>
                  <div className="text-xs text-red-200">Co-founder & CEO, iNtheBox</div>
                </div>
              </div>
            </div>

            {/* Card 2: Kavya Goel - DevLearn */}
            <div className="relative rounded-3xl overflow-hidden text-white shadow-xl min-h-[460px] flex flex-col justify-between p-7 sm:p-8 group bg-[#0C233B]">
              {/* Background Photo with Blue Duotone Gradient Scrim */}
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-45 group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: "url('https://cdn.cardtr.ee/profile-pic-1785152483039.png')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04101E] via-[#0B2545]/70 to-[#103B6D]/60" />

              {/* Company Logo at Top */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="text-white font-serif tracking-[0.25em] text-sm font-bold">
                  D E V L E A R N
                </div>
              </div>

              {/* Quote & Author Info at Bottom */}
              <div className="relative z-10 space-y-4 pt-24">
                <blockquote className="text-sm sm:text-base font-medium leading-relaxed text-zinc-100">
                  &ldquo;SyncSpace&apos;s thoughtful local-first design speeds up collaboration and decisions so we can deliver impact to our customers faster.&rdquo;
                </blockquote>
                <div className="pt-3 border-t border-white/20">
                  <div className="font-bold text-white font-display text-sm">Kavya Goel</div>
                  <div className="text-xs text-blue-200">Co-Founder, DevLearn</div>
                </div>
              </div>
            </div>

            {/* Card 3: Anshika - BitesByBytes */}
            <div className="relative rounded-3xl overflow-hidden text-white shadow-xl min-h-[460px] flex flex-col justify-between p-7 sm:p-8 group bg-[#3B2C0C]">
              {/* Background Photo with Amber Duotone Gradient Scrim */}
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-45 group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: "url('https://www.notion.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fspoqsaf9291f%2F7zZEdS2V3xP0pEJC8zLQLk%2F562bd52cf8f28a2f392b3873ace249be%2FNotion_Faire_Hero_16x9_WEB.01_02_24_17.Still007.png&w=3840&q=100')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1203] via-[#3D2C0C]/70 to-[#5C4312]/60" />

              {/* Company Logo at Top */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-white font-display font-extrabold text-lg tracking-tight">
                  <span>bitesbybytes</span>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                </div>
              </div>

              {/* Quote & Author Info at Bottom */}
              <div className="relative z-10 space-y-4 pt-24">
                <blockquote className="text-sm sm:text-base font-medium leading-relaxed text-zinc-100">
                  &ldquo;SyncSpace Custom Workspaces help our team go beyond doing work with local CRDTs to building tools that do the heavy lifting for us.&rdquo;
                </blockquote>
                <div className="pt-3 border-t border-white/20">
                  <div className="font-bold text-white font-display text-sm">Anshika</div>
                  <div className="text-xs text-amber-200">Founder, BitesByBytes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION (Notion Light Style) */}
      <section className="py-24 border-t border-[#E2E4E9] bg-[#FAF9F6] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#14171A] font-display">
            Get started today.
          </h2>
          <p className="text-base text-[#626875] max-w-xl mx-auto">
            Experience local-first velocity. Create your workspace in seconds and start writing.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0070F3] hover:bg-[#0060DF] px-8 py-4 text-sm font-bold text-white shadow-xl transition-all active:scale-[0.98]"
            >
              <span>Create account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. COMPREHENSIVE NOTION-GRADE FOOTER (Image 4 Reference) */}
      <footer className="border-t border-[#E2E4E9] bg-white pt-16 pb-12 px-4 sm:px-8 text-xs text-[#626875]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-[#E2E4E9]">
          {/* Brand & Language Column (Span 2) */}
          <div className="col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <SyncSpaceLogo size={28} />
              <span className="font-display font-bold text-base text-[#14171A]">SyncSpace</span>
            </div>

            {/* Social Icons (Monochrome SVGs) */}
            <div className="flex items-center gap-3 text-[#8A8F98]">
              <span className="hover:text-[#14171A] transition-colors cursor-pointer" title="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </span>
              <span className="hover:text-[#14171A] transition-colors cursor-pointer font-bold" title="X / Twitter">
                <TwitterXIcon className="w-4 h-4" />
              </span>
              <span className="hover:text-[#14171A] transition-colors cursor-pointer font-bold" title="LinkedIn">
                <LinkedInIcon className="w-4 h-4" />
              </span>
              <span className="hover:text-[#14171A] transition-colors cursor-pointer" title="GitHub">
                <GitHubIcon className="w-4 h-4" />
              </span>
              <span className="hover:text-[#14171A] transition-colors cursor-pointer" title="YouTube">
                <YouTubeIcon className="w-4 h-4" />
              </span>
            </div>

            {/* Language Selector Dropdown */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E2E4E9] bg-[#FAF9F6] text-xs text-[#14171A] font-medium shadow-xs">
                <Globe className="w-3.5 h-3.5 text-[#8A8F98]" />
                <span>English (US)</span>
                <ChevronDown className="w-3 h-3 text-[#8A8F98]" />
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-[#8A8F98]">
              <p className="hover:text-[#14171A] cursor-pointer">Cookie settings</p>
              <p>© 2026 SyncSpace Labs, Inc.</p>
            </div>
          </div>

          {/* Column 1: Company */}
          <div className="space-y-3">
            <div className="font-bold text-[#14171A] font-display text-xs uppercase tracking-wider">
              Company
            </div>
            <ul className="space-y-2">
              <li><a href="#teams" className="hover:text-[#14171A] transition-colors">About us</a></li>
              <li><a href="#teams" className="hover:text-[#14171A] transition-colors">Careers</a></li>
              <li><a href="#local-first" className="hover:text-[#14171A] transition-colors">Security</a></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Status</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Terms & privacy</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Your privacy rights</span></li>
            </ul>
          </div>

          {/* Column 2: Download */}
          <div className="space-y-3">
            <div className="font-bold text-[#14171A] font-display text-xs uppercase tracking-wider">
              Download
            </div>
            <ul className="space-y-2">
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">iOS & Android</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Mac & Windows</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Calendar</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Web Clipper</span></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <div className="font-bold text-[#14171A] font-display text-xs uppercase tracking-wider">
              Resources
            </div>
            <ul className="space-y-2">
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Help center</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Pricing</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Blog</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Community</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Connections</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Templates</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Partner programs</span></li>
            </ul>
          </div>

          {/* Column 4: SyncSpace for */}
          <div className="space-y-3">
            <div className="font-bold text-[#14171A] font-display text-xs uppercase tracking-wider">
              SyncSpace for
            </div>
            <ul className="space-y-2">
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Enterprise</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Startups</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Small business</span></li>
              <li><span className="hover:text-[#14171A] transition-colors cursor-pointer">Personal</span></li>
              <li className="pt-2">
                <span className="font-semibold text-[#0070F3] hover:underline cursor-pointer flex items-center gap-1">
                  <span>Explore more</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8A8F98]">
          <p>SyncSpace — Local-First Real-Time Collaborative Workspace Engine.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 font-medium">
            <Link href="/login" className="hover:text-[#14171A]">Log in</Link>
            <span>•</span>
            <Link href="/signup" className="hover:text-[#14171A]">Create account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
