"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";

export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  role?: string;
  pageCount?: number;
}

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceItem[];
  currentWorkspace: WorkspaceItem | null;
  onSelectWorkspace: (workspace: WorkspaceItem) => void;
  onWorkspaceCreated: (newWorkspace: WorkspaceItem) => void;
}

export function WorkspaceSwitcher({
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  onWorkspaceCreated,
}: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Clean Notion-style workspace monogram avatar
  const renderWorkspaceAvatar = (name?: string) => {
    const initial = (name || "W")[0]?.toUpperCase() || "W";
    return (
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 font-bold text-xs text-[#0070F3] font-display shadow-xs">
        {initial}
      </div>
    );
  };

  return (
    <>
      <div className="relative z-50 font-body">
        {/* Workspace Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-left hover:bg-accent/50 hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            {renderWorkspaceAvatar(currentWorkspace?.name)}
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-foreground font-display">
                {currentWorkspace?.name || "Select Workspace"}
              </div>
              <div className="truncate text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                {currentWorkspace?.role || "OWNER"}
              </div>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
        </button>

        {/* Dropdown Menu Overlay - 100% Solid Opaque (Light & Dark Mode) */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-[80]"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 right-0 top-full z-[100] mt-1.5 rounded-xl border border-border bg-white dark:bg-[#1A1D24] p-1.5 shadow-2xl ring-1 ring-black/10"
              >
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
                  Workspaces
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                  {workspaces.length > 0 ? (
                    workspaces.map((ws) => {
                      const isSelected = ws.id === currentWorkspace?.id;
                      return (
                        <button
                          key={ws.id}
                          type="button"
                          onClick={() => {
                            onSelectWorkspace(ws);
                            setIsOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-950/50 text-[#0070F3] font-semibold border border-blue-200 dark:border-blue-800"
                              : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {renderWorkspaceAvatar(ws.name)}
                            <span className="truncate font-medium">{ws.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#0070F3] flex-shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-2.5 py-2 text-xs text-slate-400">
                      No workspaces found
                    </div>
                  )}
                </div>

                <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsDialogOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#0070F3]" />
                    <span>Create new workspace</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={(newWs) => {
          onWorkspaceCreated(newWs);
          onSelectWorkspace(newWs);
        }}
      />
    </>
  );
}
