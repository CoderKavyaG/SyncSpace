"use client";

import React, { useState } from "react";
import {
  PanelLeft,
  Search,
  Share2,
  Settings,
  Copy,
  Check,
  Globe,
  Users,
  Lock,
} from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/topbar/breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { PresenceAvatarStack, UserPresenceInfo } from "@/components/topbar/presence-avatar-stack";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserAvatar } from "@/components/ui/user-avatar";
import { toast } from "sonner";

interface TopbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  workspaceName?: string;
  breadcrumbs: BreadcrumbItem[];
  collaborators?: UserPresenceInfo[];
  activePageId?: string | null;
  onSelectBreadcrumb: (id: string) => void;
  onOpenCommandPalette: () => void;
  onOpenSettings?: () => void;
}

export function Topbar({
  isSidebarCollapsed,
  onToggleSidebar,
  workspaceName,
  breadcrumbs,
  collaborators = [],
  activePageId,
  onSelectBreadcrumb,
  onOpenCommandPalette,
  onOpenSettings,
}: TopbarProps) {
  const { user } = useCurrentUser();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setHasCopied(true);
    toast.success("Page link copied to clipboard!");
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <header className="relative flex h-13 w-full items-center justify-between border-b border-border bg-card/60 px-4 sm:px-6 backdrop-blur-md z-20 font-body transition-all">
      {/* 1. Left Section: Sidebar expand button & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
            title="Expand sidebar (⌘+B)"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <Breadcrumbs
          workspaceName={workspaceName}
          breadcrumbs={breadcrumbs}
          onSelectBreadcrumb={onSelectBreadcrumb}
        />
      </div>

      {/* 2. Middle Section: Centered Search Bar (⌘K) */}
      <div className="flex-1 flex justify-center px-4 max-w-xl mx-auto">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex w-full max-w-md items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-background/80 hover:bg-accent/50 px-3.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shadow-xs group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            <span className="truncate text-xs font-medium">
              Search pages, tasks, or commands...
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground font-semibold shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* 3. Right Section: Share Button, Settings, Presence, Theme, Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        {/* Live Collaborators Presence Stack */}
        <PresenceAvatarStack collaborators={collaborators} />

        {/* Notion-Grade Share Popover Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsShareOpen(!isShareOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 hover:bg-accent/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            title="Share document & copy shareable link"
          >
            <Share2 className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Share Popover Menu */}
          {isShareOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsShareOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-foreground font-display">
                      Share & Collaborate
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-secondary/10 text-secondary border border-secondary/20">
                    Live CRDT
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Workspace Access</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    All workspace members can view and collaborate on this note in real time.
                  </p>
                </div>

                {/* 1-Click Copy Page Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-3 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Shareable Link</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Workspace Settings Dialog Trigger */}
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
            title="Workspace Settings & Team Invites"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}

        <ThemeToggle />

        <UserAvatar name={user?.name} image={user?.image} size="sm" />
      </div>
    </header>
  );
}
