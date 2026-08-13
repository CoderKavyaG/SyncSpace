"use client";

import React from "react";
import {
  Sparkles,
  Zap,
  HardDrive,
  GitMerge,
  ShieldCheck,
  Cpu,
  Keyboard,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Layers,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SyncSpaceLogo } from "@/components/ui/syncspace-logo";
import { NotionFlyingBook, NotionAssistantMascot } from "@/components/ui/notion-doodles";

export default function SyncSpaceUpdatesPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-8 space-y-12 font-body select-none text-foreground">
      {/* Back Button */}
      <Link
        href="/workspace"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to workspace</span>
      </Link>

      {/* Header with Flying Book Doodle */}
      <div className="space-y-4 border-b border-border pb-8">
        <div className="flex items-center gap-3">
          <SyncSpaceLogo size={36} />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SyncSpace Engine v2.0 • Live Guide</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight font-display text-foreground">
          How SyncSpace Works &amp; What&apos;s Different
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          SyncSpace is built from the ground up on local-first architecture. Unlike traditional cloud editors where you wait on network roundtrips, SyncSpace stores everything on your device first.
        </p>
      </div>

      {/* SECTION 1: ARCHITECTURE COMPARISON */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            1. Local-First vs Traditional Cloud Editors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traditional Cloud */}
          <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 space-y-3">
            <div className="text-xs font-bold uppercase text-destructive font-display">
              Traditional Cloud (Notion, Google Docs)
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                <span>Typing requires server roundtrip (150ms - 800ms latency).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                <span>Cannot write offline; shows &quot;Reconnecting...&quot; spinner.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive font-bold">✕</span>
                <span>Central server resolves conflicts with locks or overwrites.</span>
              </li>
            </ul>
          </div>

          {/* SyncSpace Local-First */}
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="text-xs font-bold uppercase text-emerald-600 font-display">
              SyncSpace Local-First Architecture
            </div>
            <ul className="space-y-2 text-xs text-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span><strong>0ms Keystroke Latency:</strong> Immediate client-side ProseMirror transaction execution.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span><strong>100% Offline Persistence:</strong> Documents save continuously to browser IndexedDB.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span><strong>CRDT Conflict-Free Merging:</strong> Yjs vector clocks merge simultaneous peer edits seamlessly.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW YJS CRDTS WORK */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-secondary" />
          <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            2. Real-Time Multiplayer with Yjs CRDTs
          </h2>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            When multiple teammates edit the same paragraph at the exact same millisecond, SyncSpace does not rely on a central locking server. Instead, mathematical <strong>Conflict-Free Replicated Data Types (CRDTs)</strong> ensure that every client computes the exact same final document state deterministically.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-center">
            <div className="p-3 rounded-xl bg-background border border-border space-y-1">
              <div className="font-bold text-foreground font-mono">1. Local Edit</div>
              <p className="text-[11px] text-muted-foreground">Applies directly to local Yjs Doc in 0ms</p>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border space-y-1">
              <div className="font-bold text-primary font-mono">2. WebSocket Broadcast</div>
              <p className="text-[11px] text-muted-foreground">Binary delta update sent to connected peers</p>
            </div>
            <div className="p-3 rounded-xl bg-background border border-border space-y-1">
              <div className="font-bold text-emerald-500 font-mono">3. CRDT Convergence</div>
              <p className="text-[11px] text-muted-foreground">Peers merge delta without locks or collisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: KEYBOARD SHORTCUTS & POWER TOOLS */}
      <section className="space-y-6 pb-8">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            3. Keyboard Shortcuts &amp; Power Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
            <span>Slash Command Menu</span>
            <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono font-bold text-foreground">
              /
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
            <span>Global Quick Find / Search</span>
            <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono font-bold text-foreground">
              ⌘K / Ctrl+K
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
            <span>Toggle Left Sidebar</span>
            <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono font-bold text-foreground">
              ⌘B / Ctrl+B
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
            <span>Undo / Redo (CRDT History)</span>
            <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono font-bold text-foreground">
              ⌘Z / ⌘⇧Z
            </kbd>
          </div>
        </div>
      </section>
    </div>
  );
}
