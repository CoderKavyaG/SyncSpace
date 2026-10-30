"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Settings,
  Mail,
  UserPlus,
  Shield,
  Trash2,
  Copy,
  Check,
  Building,
  Loader2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { WorkspaceItem } from "./workspace-switcher";
import { UserAvatar } from "@/components/ui/user-avatar";

interface WorkspaceMemberRecord {
  id: string;
  role: "OWNER" | "EDITOR" | "VIEWER";
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

interface WorkspaceSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: WorkspaceItem | null;
  onWorkspaceUpdated?: (updatedWs: Partial<WorkspaceItem>) => void;
}

export function WorkspaceSettingsDialog({
  isOpen,
  onClose,
  workspace,
  onWorkspaceUpdated,
}: WorkspaceSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<"general" | "members">("general");

  // General Settings State
  const [workspaceName, setWorkspaceName] = useState(workspace?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);

  // Members Tab State
  const [members, setMembers] = useState<WorkspaceMemberRecord[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"EDITOR" | "VIEWER">("EDITOR");
  const [isInviting, setIsInviting] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  useEffect(() => {
    if (workspace?.name) {
      setWorkspaceName(workspace.name);
    }
  }, [workspace?.name]);

  const fetchMembers = async () => {
    if (!workspace?.id) return;
    setIsLoadingMembers(true);
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error("Fetch members error:", err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (isOpen && workspace?.id) {
      fetchMembers();
    }
  }, [isOpen, workspace?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id || !workspaceName.trim()) return;

    setIsSavingName(true);
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workspaceName.trim() }),
      });

      if (res.ok) {
        toast.success("Workspace name updated");
        if (onWorkspaceUpdated) {
          onWorkspaceUpdated({ name: workspaceName.trim() });
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update workspace");
      }
    } catch (err) {
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSavingName(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace?.id || !inviteEmail.trim() || isInviting) return;

    setIsInviting(true);
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Invited ${inviteEmail.trim()} as ${inviteRole}`);
        setInviteEmail("");
        fetchMembers();
      } else {
        toast.error(data.error || "Failed to invite member");
      }
    } catch (err) {
      toast.error("Network error while inviting member");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!workspace?.id) return;

    try {
      const res = await fetch(
        `/api/workspaces/${workspace.id}/members?memberId=${memberId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        toast.success(`Removed ${memberEmail} from workspace`);
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to remove member");
      }
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  const getInviteUrl = () => {
    if (typeof window === "undefined" || !workspace?.slug) return "";
    return `${window.location.origin}/workspace?join=${workspace.slug}`;
  };

  const handleCopyInviteLink = () => {
    const url = getInviteUrl();
    if (!url) return;

    navigator.clipboard.writeText(url);
    setHasCopiedLink(true);
    toast.success("Workspace invite link copied to clipboard!");
    setTimeout(() => setHasCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-body">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Workspace Settings
                </h3>
                <p className="text-xs text-muted-foreground">
                  {workspace?.name || "SyncSpace"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-border/60 pb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "general"
                  ? "bg-accent/80 text-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>General</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("members")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "members"
                  ? "bg-accent/80 text-foreground font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Members ({members.length})</span>
            </button>
          </div>

          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 font-display text-[11px]">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Acme Engineering"
                  required
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 font-display text-[11px]">
                  Workspace Slug / Identifier
                </label>
                <div className="rounded-xl border border-border/80 bg-background/50 px-3.5 py-2 text-xs font-mono text-muted-foreground flex items-center justify-between">
                  <span>{workspace?.slug || workspace?.id}</span>
                  <span className="text-[10px] uppercase font-bold text-primary">Active</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingName}
                  className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 font-semibold shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isSavingName ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MEMBERS & TEAM INVITATION */}
          {activeTab === "members" && (
            <div className="space-y-5 text-xs">
              {/* Shareable Invite Link */}
              <div className="rounded-xl border border-border/80 bg-background/50 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground font-display">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5 text-primary" />
                    <span>Workspace Shareable Invite Link</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Anyone with this link can join this workspace as an Editor.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getInviteUrl()}
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono text-muted-foreground select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyInviteLink}
                    className="flex items-center gap-1.5 rounded-lg bg-secondary/15 hover:bg-secondary/25 text-secondary-foreground border border-secondary/30 px-3 py-1.5 font-semibold transition-all cursor-pointer"
                  >
                    {hasCopiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Invite Form */}
              <form onSubmit={handleInviteMember} className="space-y-2">
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground text-[11px] font-display">
                  Invite Member by Email
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="teammate@company.com"
                      required
                      className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="rounded-xl border border-border bg-background px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="EDITOR">Editor</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isInviting}
                    className="flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-2 font-semibold shadow-xs transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                  >
                    {isInviting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5" />
                    )}
                    <span>Invite</span>
                  </button>
                </div>
              </form>

              {/* Members Roster List */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-display">
                  Team Members ({members.length})
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {isLoadingMembers ? (
                    <div className="py-4 text-center text-xs text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-primary" />
                      Loading roster...
                    </div>
                  ) : members.length > 0 ? (
                    members.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-background/60 border border-border/80"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UserAvatar name={m.user.name} image={m.user.avatarUrl} size="sm" />
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate text-xs">
                              {m.user.name || m.user.email.split("@")[0]}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono truncate">
                              {m.user.email}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                              m.role === "OWNER"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : m.role === "EDITOR"
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {m.role}
                          </span>

                          {m.role !== "OWNER" && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(m.id, m.user.email)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Remove member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-center text-xs text-muted-foreground">
                      No team members found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

