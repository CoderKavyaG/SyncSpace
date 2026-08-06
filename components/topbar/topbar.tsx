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
    <header className="flex h-12 w-full items-center justify-between border-b border-border bg-card/40 px-4 backdrop-blur-md z-20 font-body">
      {/* Left Section: Sidebar expand button & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isSidebarCollapsed && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
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

      {/* Right Section: Presence Stack, Command Palette Trigger, Theme Toggle & User Avatar */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Live Collaborators Presence Stack */}
        <PresenceAvatarStack collaborators={collaborators} />

        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick Find...</span>
          <kbd className="rounded border border-border bg-card px-1.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />

        <UserAvatar name={user?.name} image={user?.image} size="sm" />
      </div>
    </header>
  );
}
