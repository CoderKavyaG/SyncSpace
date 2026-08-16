"use client";

import React from "react";
import { PanelLeft, Search, User as UserIcon } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/topbar/breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { PresenceAvatarStack, UserPresenceInfo } from "@/components/topbar/presence-avatar-stack";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserAvatar } from "@/components/ui/user-avatar";

interface TopbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  workspaceName?: string;
  breadcrumbs: BreadcrumbItem[];
  collaborators?: UserPresenceInfo[];
  onSelectBreadcrumb: (id: string) => void;
  onOpenCommandPalette: () => void;
}

export function Topbar({
  isSidebarCollapsed,
  onToggleSidebar,
  workspaceName,
  breadcrumbs,
  collaborators = [],
  onSelectBreadcrumb,
  onOpenCommandPalette,
}: TopbarProps) {
  const { user } = useCurrentUser();

  return (
    <header className="flex h-13 w-full items-center justify-between border-b border-border bg-card/60 px-4 sm:px-6 backdrop-blur-md z-20 font-body transition-all">
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

      {/* 2. Middle Section: Prominent, Centered & Larger Search Bar (⌘K) */}
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

      {/* 3. Right Section: Live Presence Stack, Theme Toggle & User Avatar */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Live Collaborators Presence Stack */}
        <PresenceAvatarStack collaborators={collaborators} />

        <ThemeToggle />

        <UserAvatar name={user?.name} image={user?.image} size="sm" />
      </div>
    </header>
  );
}
