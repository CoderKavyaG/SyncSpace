"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  FilePlus,
  Layers,
  Search,
  Keyboard,
  ArrowRight,
  Zap,
  BookOpen,
  Users,
  CheckCircle2,
  Circle,
  HardDrive,
  CheckSquare,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/ui/user-avatar";

export default function WorkspaceDefaultPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [pages, setPages] = useState<any[]>([]);

  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({
    1: true,
  });

  // Fetch available workspace pages so card clicks route to the live document
  useEffect(() => {
    async function loadPages() {
      try {
        const wsRes = await fetch("/api/workspaces");
        if (wsRes.ok) {
          const workspaces = await wsRes.json();
          if (workspaces.length > 0) {
            const pagesRes = await fetch(`/api/workspaces/${workspaces[0].id}/pages`);
            if (pagesRes.ok) {
              const pagesData = await pagesRes.json();
              setPages(pagesData);
            }
          }
        }
      } catch (err) {
        console.error("Error loading pages for dashboard quick links:", err);
      }
    }
    loadPages();
  }, []);

  const navigateToMatchingPage = (searchTitle: string) => {
    const matched = pages.find((p) =>
      p.title?.toLowerCase().includes(searchTitle.toLowerCase())
    );
    if (matched) {
      router.push(`/workspace/${matched.id}`);
    } else if (pages.length > 0) {
      router.push(`/workspace/${pages[0].id}`);
    }
  };

  const toggleTask = (id: number) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    // Trigger associated action
    if (id === 2) {
      navigateToMatchingPage("Roadmap");
    } else if (id === 3) {
      navigateToMatchingPage("Getting Started");
    } else if (id === 4) {
      navigateToMatchingPage("Weekly");
    }
  };

  const tasks = [
    { id: 1, title: "Initialize your local-first workspace", subtitle: "Completed upon workspace setup" },
    { id: 2, title: "Type / anywhere to trigger slash commands", subtitle: "Insert headings, checklists, tables, and code" },
    { id: 3, title: "Test offline-to-online CRDT synchronization", subtitle: "Disconnect your Wi-Fi, write edits, and reconnect" },
    { id: 4, title: "Invite peers or open in a second browser window", subtitle: "Experience Figma-style live multiplayer carets" },
  ];

  return (
    <div className="flex h-full w-full max-w-4xl mx-auto flex-col justify-start py-8 px-4 sm:px-6 select-none font-body antialiased">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        {/* TOP WELCOME HEADER (Notion Reference) */}
        <div className="space-y-3">
          <div className="flex items-center gap-3.5">
            <UserAvatar name={user?.name} image={user?.image} size="lg" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
                Hey, {user?.name || "there"}. Welcome to SyncSpace
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Your local-first collaborative canvas. Every keystroke is saved immediately to IndexedDB and synced via Yjs CRDTs.
              </p>
            </div>
          </div>
        </div>

        {/* 3 INTERACTIVE QUICK START CARDS (Image 2 Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Product Roadmap */}
          <div
            onClick={() => navigateToMatchingPage("Roadmap")}
            className="group relative rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground font-display">
                Product Roadmap & OKRs
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track engineering initiatives, milestones, and task checklists with zero latency.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center text-xs font-semibold text-primary">
              <span>Open document</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Weekly Team Sync */}
          <div
            onClick={() => navigateToMatchingPage("Weekly")}
            className="group relative rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-secondary/50 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground font-display">
                Weekly Meeting Sync
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Structured agenda, action items, and real-time multiplayer note-taking.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center text-xs font-semibold text-secondary">
              <span>Open document</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Local-First Resilience */}
          <div
            onClick={() => navigateToMatchingPage("Getting Started")}
            className="group relative rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-amber-400/50 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-foreground font-display">
                Local-First Resilience
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Write anywhere. IndexedDB saves offline and merges conflict-free when online.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center text-xs font-semibold text-amber-400">
              <span>Open guide</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* ONBOARDING CHECKLIST SECTION (Image 1 Reference) */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground font-display">
                Getting Started Checklist
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {Object.values(completedTasks).filter(Boolean).length} / {tasks.length} completed
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {tasks.map((task) => {
              const isChecked = !!completedTasks[task.id];
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-accent/30 border-border/60 text-muted-foreground"
                      : "bg-background/40 border-border/80 hover:border-primary/40 hover:bg-accent/40 text-foreground"
                  }`}
                >
                  <button type="button" className="mt-0.5 flex-shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs font-semibold font-display ${
                        isChecked ? "line-through opacity-70" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {task.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
