"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  PanelLeftClose,
  FilePlus,
  FileText,
  LogOut,
  Sparkles,
  Search,
  Home,
  CheckCircle2,
  Folder,
  Layers,
  HelpCircle,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Target,
  CheckSquare,
  Calendar,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { WorkspaceSwitcher, WorkspaceItem } from "@/components/workspace/workspace-switcher";
import { PageTreeItem } from "@/components/sidebar/page-tree-item";
import { SidebarSkeleton } from "@/components/sidebar/sidebar-skeleton";
import { PageTreeNode } from "@/lib/page-tree-builder";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserAvatar } from "@/components/ui/user-avatar";

interface SidebarProps {
  workspaces: WorkspaceItem[];
  currentWorkspace: WorkspaceItem | null;
  pageTree: PageTreeNode[];
  activePageId?: string | null;
  isLoadingPages?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectWorkspace: (workspace: WorkspaceItem) => void;
  onWorkspaceCreated: (workspace: WorkspaceItem) => void;
  onSelectPage: (pageId: string) => void;
  onCreatePage: (parentPageId?: string | null, customTitle?: string) => void;
  onRenamePage: (pageId: string, currentTitle: string) => void;
  onDeletePage: (pageId: string, currentTitle: string) => void;
  onOpenCommandPalette: () => void;
  onOpenTrash: () => void;
}

export function Sidebar({
  workspaces,
  currentWorkspace,
  pageTree,
  activePageId,
  isLoadingPages = false,
  isCollapsed,
  onToggleCollapse,
  onSelectWorkspace,
  onWorkspaceCreated,
  onSelectPage,
  onCreatePage,
  onRenamePage,
  onDeletePage,
  onOpenCommandPalette,
  onOpenTrash,
}: SidebarProps) {
  const { user } = useCurrentUser();
  const [showOnboardingWidget, setShowOnboardingWidget] = useState(true);
  const [isPrivateExpanded, setIsPrivateExpanded] = useState(true);
  const [isTeamspacesExpanded, setIsTeamspacesExpanded] = useState(true);

  // Expanded folders inside Teamspaces
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    projects: true,
    tasks: true,
    meetings: true,
    docs: true,
  });

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderKey]: !prev[folderKey],
    }));
  };

  // Filter pages by category matching
  const projectPages = pageTree.filter((p) =>
    p.title.toLowerCase().includes("roadmap") || p.title.toLowerCase().includes("project")
  );
  const taskPages = pageTree.filter((p) =>
    p.title.toLowerCase().includes("task") || p.title.toLowerCase().includes("todo")
  );
  const meetingPages = pageTree.filter((p) =>
    p.title.toLowerCase().includes("sync") || p.title.toLowerCase().includes("meeting")
  );
  const docPages = pageTree.filter((p) =>
    p.title.toLowerCase().includes("guide") || p.title.toLowerCase().includes("started") || p.title.toLowerCase().includes("doc")
  );

  const handleOpenOrCreateCategory = (
    categoryName: string,
    existingPages: PageTreeNode[],
    defaultTitle: string
  ) => {
    if (existingPages.length > 0) {
      onSelectPage(existingPages[0].id);
    } else {
      onCreatePage(null, defaultTitle);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 0 : 260 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex h-screen flex-col border-r border-border/80 bg-card/60 backdrop-blur-md overflow-hidden z-30 font-body select-none"
    >
      <div className="flex h-full w-[260px] flex-col justify-between p-3 space-y-3">
        {/* 1. FIXED TOP HEADER: Workspace Switcher & Collapse Button */}
        <div className="relative z-50 flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex-grow flex-1 min-w-0">
            <WorkspaceSwitcher
              workspaces={workspaces}
              currentWorkspace={currentWorkspace}
              onSelectWorkspace={onSelectWorkspace}
              onWorkspaceCreated={onWorkspaceCreated}
            />
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
            title="Collapse sidebar (⌘+B)"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* 2. SCROLLABLE MIDDLE BODY: Navigation, Onboarding Widget, Private Tree, Teamspaces */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {/* Action Row: Home, Search, SyncSpace Updates (Image 5 Reference) */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => onSelectPage("")}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                !activePageId
                  ? "bg-accent/70 text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              }`}
            >
              <Home className="w-4 h-4 text-primary" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span>Search</span>
              </div>
              <kbd className="rounded border border-border/80 bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => onSelectPage("updates")}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activePageId === "updates"
                  ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#0070F3]" />
              <span>SyncSpace Updates</span>
            </button>
          </div>

          {/* Onboarding / Quick Start Widget in Sidebar (Image 2 & 5 Reference) */}
          {showOnboardingWidget && (
            <div className="rounded-xl border border-border/80 bg-background/60 p-3 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-xs font-bold text-amber-800">
                    S
                  </div>
                  <span className="text-xs font-bold text-foreground font-display">
                    Welcome to SyncSpace
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOnboardingWidget(false)}
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5 text-[11px] text-muted-foreground pt-1">
                <div
                  onClick={() => onSelectPage("")}
                  className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-primary/60 bg-primary/20" />
                  <span>Get organized in minutes</span>
                </div>
                <div
                  onClick={() => onSelectPage("updates")}
                  className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-border" />
                  <span>Never lose notes with CRDTs</span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-border/60" />

          {/* PRIVATE PAGES SECTION (Image 3 Reference) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-display">
              <button
                type="button"
                onClick={() => setIsPrivateExpanded(!isPrivateExpanded)}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {isPrivateExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Private</span>
              </button>
              <button
                type="button"
                onClick={() => onCreatePage(null)}
                className="p-0.5 rounded hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                title="Add new private page"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {isPrivateExpanded && (
              <div className="space-y-0.5 pr-1">
                {isLoadingPages ? (
                  <SidebarSkeleton />
                ) : pageTree.length > 0 ? (
                  pageTree.map((page) => (
                    <PageTreeItem
                      key={page.id}
                      page={page}
                      activePageId={activePageId}
                      onSelectPage={onSelectPage}
                      onCreateSubpage={(parentId) => onCreatePage(parentId)}
                      onRenamePage={onRenamePage}
                      onDeletePage={(id) => onDeletePage(id, page.title)}
                    />
                  ))
                ) : (
                  <div className="px-2.5 py-2 text-xs text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => onCreatePage(null)}
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add a page</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TEAMSPACES SECTION WITH REAL FOLDERS & SUBPAGES (Images 1 & 3 Match) */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-display">
              <button
                type="button"
                onClick={() => setIsTeamspacesExpanded(!isTeamspacesExpanded)}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {isTeamspacesExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Teamspaces</span>
              </button>
            </div>

            {isTeamspacesExpanded && (
              <div className="space-y-1 text-xs">
                {/* 1. Projects Folder */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between group rounded-lg px-2 py-1.5 hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors">
                    <div
                      onClick={() =>
                        handleOpenOrCreateCategory("Projects", projectPages, "Product Roadmap & OKRs")
                      }
                      className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="font-medium text-foreground">Projects</span>
                      <span className="text-[10px] text-muted-foreground">({projectPages.length})</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onCreatePage(null, "New Project Roadmap")}
                        className="p-1 rounded hover:bg-accent hover:text-foreground"
                        title="Add project page"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFolder("projects")}
                        className="p-1 rounded hover:bg-accent hover:text-foreground"
                      >
                        {expandedFolders.projects ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {expandedFolders.projects && projectPages.length > 0 && (
                    <div className="pl-6 space-y-0.5 border-l border-border/40 ml-3">
                      {projectPages.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectPage(p.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] truncate cursor-pointer transition-colors ${
                            activePageId === p.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Tasks Folder */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between group rounded-lg px-2 py-1.5 hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors">
                    <div
                      onClick={() =>
                        handleOpenOrCreateCategory("Tasks", taskPages, "Sprint Tasks & Backlog")
                      }
                      className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="font-medium text-foreground">Tasks</span>
                      <span className="text-[10px] text-muted-foreground">({taskPages.length})</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onCreatePage(null, "Sprint Task Checklist")}
                        className="p-1 rounded hover:bg-accent hover:text-foreground"
                        title="Add task list"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFolder("tasks")}
                        className="p-1 rounded hover:bg-accent hover:text-foreground"
                      >
                        {expandedFolders.tasks ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {expandedFolders.tasks && taskPages.length > 0 && (
                    <div className="pl-6 space-y-0.5 border-l border-border/40 ml-3">
                      {taskPages.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectPage(p.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] truncate cursor-pointer transition-colors ${
                            activePageId === p.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Meetings Folder */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between group rounded-lg px-2 py-1.5 hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors">
                    <div
                      onClick={() =>
                        handleOpenOrCreateCategory("Meetings", meetingPages, "Weekly Team Sync")
                      }
                      className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="font-medium text-foreground">Meetings</span>
                      <span className="text-[10px] text-muted-foreground">({meetingPages.length})</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onCreatePage(null, "New Meeting Notes")}
                        className="p-1 rounded hover:bg-accent hover:text-foreground"
                        title="Add meeting note"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFolder("meetings")}
                        className="p-1 rounded hover:bg-accent hover:text-foreground"
                      >
                        {expandedFolders.meetings ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {expandedFolders.meetings && meetingPages.length > 0 && (
                    <div className="pl-6 space-y-0.5 border-l border-border/40 ml-3">
                      {meetingPages.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectPage(p.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] truncate cursor-pointer transition-colors ${
                            activePageId === p.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Docs Folder */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between group rounded-lg px-2 py-1.5 hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors">
                    <div
                      onClick={() =>
                        handleOpenOrCreateCategory("Docs", docPages, "Getting Started with SyncSpace")
                      }
                      className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-foreground">Docs</span>
                      <span className="text-[10px] text-muted-foreground">({docPages.length})</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => onCreatePage(null, "System Documentation")}
                        className="p-1 rounded hover:bg-accent hover:text-foreground"
                        title="Add doc"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFolder("docs")}
                        className="p-1 rounded hover:bg-accent hover:text-foreground"
                      >
                        {expandedFolders.docs ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {expandedFolders.docs && docPages.length > 0 && (
                    <div className="pl-6 space-y-0.5 border-l border-border/40 ml-3">
                      {docPages.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => onSelectPage(p.id)}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] truncate cursor-pointer transition-colors ${
                            activePageId === p.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{p.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. BOTTOM SECTION: (+ New Page ABOVE profile, User Profile Bar, Trash & Utility Bar) (Image 5 Match) */}
        <div className="space-y-2 pt-2 border-t border-border/80 flex-shrink-0">
          {/* Primary '+ New page' Button ABOVE Email Profile (Image 5 Reference) */}
          <button
            type="button"
            onClick={() => onCreatePage(null)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground py-2 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New page</span>
          </button>

          {/* User Profile Bar with Generated Notion Avatar & Sign Out */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-background/60 border border-border/80">
            <div className="flex items-center gap-2 min-w-0">
              <UserAvatar name={user?.name} image={user?.image} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-foreground font-display">
                  {user?.name || "Member"}
                </div>
                <div className="truncate text-[10px] text-muted-foreground font-mono">
                  {user?.email || "online"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Utility Row: Trash Bin (15-Day Auto Delete), Library, Help */}
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground px-1">
            <button
              type="button"
              onClick={onOpenTrash}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
              title="Trash Bin (15-day recovery window)"
            >
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              <span className="text-[11px]">Trash (15d)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectPage("updates")}
                className="hover:text-foreground transition-colors cursor-pointer p-1"
                title="SyncSpace Guide"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSelectPage("updates")}
                className="hover:text-foreground transition-colors cursor-pointer p-1"
                title="Help & Feedback"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
