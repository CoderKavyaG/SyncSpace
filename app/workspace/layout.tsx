"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Topbar } from "@/components/topbar/topbar";
import { CommandPalette } from "@/components/topbar/command-palette";
import { WorkspaceItem } from "@/components/workspace/workspace-switcher";
import { PageTreeNode } from "@/lib/page-tree-builder";
import { BreadcrumbItem } from "@/components/topbar/breadcrumbs";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Loader2, X, AlertCircle } from "lucide-react";
import { TrashDialog } from "@/components/workspace/trash-dialog";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceItem | null>(null);
  const [pageTree, setPageTree] = useState<PageTreeNode[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  // Custom Modal States
  const [pageToRename, setPageToRename] = useState<{ id: string; title: string } | null>(null);
  const [renameInputValue, setRenameInputValue] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const [pageToDelete, setPageToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract active page ID from path `/workspace/[pageId]`
  const activePageId = pathname.split("/").pop() || null;

  // 1. Fetch user's workspaces
  const fetchWorkspaces = useCallback(async () => {
    try {
      const res = await fetch("/api/workspaces");
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
        if (data.length > 0) {
          setCurrentWorkspace((prev) => prev || data[0]);
        }
      } else if (res.status === 401) {
        signOut({ callbackUrl: "/login" });
      }
    } catch (err) {
      console.error("Fetch workspaces error:", err);
    }
  }, []);

  // 2. Fetch page tree for current workspace
  const fetchPageTree = useCallback(async (workspaceId: string) => {
    setIsLoadingPages(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/pages`);
      if (res.ok) {
        const tree = await res.json();
        setPageTree(tree);
      }
    } catch (err) {
      console.error("Fetch page tree error:", err);
    } finally {
      setIsLoadingPages(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchPageTree(currentWorkspace.id);
    }
  }, [currentWorkspace?.id, fetchPageTree]);

  // Real-time title synchronization with sidebar
  useEffect(() => {
    const handleTitleUpdate = (e: any) => {
      const { pageId, title } = e.detail || {};
      if (!pageId) return;

      setPageTree((prevTree) => {
        const updateNode = (nodes: PageTreeNode[]): PageTreeNode[] => {
          return nodes.map((n) => {
            if (n.id === pageId) {
              return { ...n, title: title || "Untitled" };
            }
            if (n.children && n.children.length > 0) {
              return { ...n, children: updateNode(n.children) };
            }
            return n;
          });
        };
        return updateNode(prevTree);
      });
    };

    window.addEventListener("page-title-updated", handleTitleUpdate);
    return () => window.removeEventListener("page-title-updated", handleTitleUpdate);
  }, []);

  // Handle keyboard shortcut (⌘+B / Ctrl+B) for toggling sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handlers for Page CRUD
  const handleSelectPage = (pageId: string) => {
    if (pageId === "updates") {
      router.push("/workspace/updates");
    } else if (pageId) {
      router.push(`/workspace/${pageId}`);
    } else {
      router.push("/workspace");
    }
  };

  const handleCreatePage = async (parentPageId?: string | null, customTitle?: string) => {
    if (!currentWorkspace?.id || isCreatingPage) return;
    setIsCreatingPage(true);
    try {
      const res = await fetch(`/api/workspaces/${currentWorkspace.id}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: customTitle || "Untitled",
          parentPageId: parentPageId || null,
        }),
      });

      if (res.ok) {
        const newPage = await res.json();
        await fetchPageTree(currentWorkspace.id);
        toast.success(`Created "${newPage.title || "Untitled"}"`);
        router.push(`/workspace/${newPage.id}`);
      } else {
        toast.error("Failed to create page");
      }
    } catch (err) {
      console.error("Create page error:", err);
      toast.error("An error occurred while creating page");
    } finally {
      setIsCreatingPage(false);
    }
  };

  const openRenameModal = (pageId: string, currentTitle: string) => {
    setPageToRename({ id: pageId, title: currentTitle });
    setRenameInputValue(currentTitle || "Untitled");
  };

  const handleConfirmRename = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pageToRename || !renameInputValue.trim() || isRenaming) return;

    setIsRenaming(true);
    try {
      const res = await fetch(`/api/pages/${pageToRename.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: renameInputValue.trim() }),
      });

      if (res.ok) {
        if (currentWorkspace?.id) {
          await fetchPageTree(currentWorkspace.id);
        }
        toast.success("Page renamed");
        setPageToRename(null);
      } else {
        toast.error("Failed to rename page");
      }
    } catch (err) {
      console.error("Rename page error:", err);
      toast.error("An error occurred while renaming page");
    } finally {
      setIsRenaming(false);
    }
  };

  const openDeleteModal = (pageId: string, currentTitle: string) => {
    setPageToDelete({ id: pageId, title: currentTitle });
  };

  const handleConfirmDelete = async () => {
    if (!pageToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (currentWorkspace?.id) {
          await fetchPageTree(currentWorkspace.id);
        }
        toast.success("Page moved to trash");
        setPageToDelete(null);

        // If the deleted page was currently active, navigate to workspace root
        if (activePageId === pageToDelete.id) {
          router.push("/workspace");
        }
      } else {
        toast.error("Failed to delete page");
      }
    } catch (err) {
      console.error("Delete page error:", err);
      toast.error("An error occurred while deleting page");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to build breadcrumbs from current pageTree
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (!activePageId || pathname === "/workspace") {
      return [{ id: "overview", title: "Overview" }];
    }
    if (pathname === "/workspace/updates") {
      return [{ id: "updates", title: "SyncSpace Updates & Architecture Guide" }];
    }

    const trail: BreadcrumbItem[] = [];
    const findPath = (nodes: PageTreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === activePageId) {
          trail.push({ id: node.id, title: node.title, icon: node.icon });
          return true;
        }
        if (node.children && node.children.length > 0) {
          if (findPath(node.children)) {
            trail.unshift({ id: node.id, title: node.title, icon: node.icon });
            return true;
          }
        }
      }
      return false;
    };

    findPath(pageTree);
    return trail.length > 0 ? trail : [{ id: activePageId, title: "Untitled" }];
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-body antialiased selection:bg-primary/20 selection:text-primary">
        {/* SIDEBAR NAVIGATION */}
        <Sidebar
          workspaces={workspaces}
          currentWorkspace={currentWorkspace}
          pageTree={pageTree}
          activePageId={activePageId}
          isLoadingPages={isLoadingPages}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onSelectWorkspace={(ws) => {
            setCurrentWorkspace(ws);
            router.push("/workspace");
          }}
          onWorkspaceCreated={(newWs) => {
            setWorkspaces((prev) => [newWs, ...prev]);
            setCurrentWorkspace(newWs);
          }}
          onSelectPage={handleSelectPage}
          onCreatePage={handleCreatePage}
          onRenamePage={openRenameModal}
          onDeletePage={openDeleteModal}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenTrash={() => setIsTrashOpen(true)}
        />

        {/* MAIN APPLICATION CANVAS */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* TOPBAR CONTROLS */}
          <Topbar
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            workspaceName={currentWorkspace?.name}
            breadcrumbs={getBreadcrumbs()}
            onSelectBreadcrumb={handleSelectPage}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* PAGE CONTENT CONTAINER */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 custom-scrollbar bg-background">
            <div
              className={`mx-auto h-full transition-all duration-300 ${
                isSidebarCollapsed ? "max-w-5xl px-2 sm:px-6" : "max-w-4xl"
              }`}
            >
              {children}
            </div>
          </main>
        </div>

        {/* GLOBAL COMMAND PALETTE (⌘K) */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          pages={pageTree}
          onSelectPage={(pageId) => {
            handleSelectPage(pageId);
            setIsCommandPaletteOpen(false);
          }}
        />

        {/* TRASH RECOVERY DIALOG */}
        <TrashDialog
          isOpen={isTrashOpen}
          onClose={() => setIsTrashOpen(false)}
          workspaceId={currentWorkspace?.id}
          onPageRestored={() => {
            if (currentWorkspace?.id) {
              fetchPageTree(currentWorkspace.id);
            }
          }}
        />

        {/* CUSTOM RENAME PAGE MODAL */}
        <AnimatePresence>
          {pageToRename && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Edit2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-foreground font-display">
                      Rename Page
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPageToRename(null)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleConfirmRename} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5 font-display">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={renameInputValue}
                      onChange={(e) => setRenameInputValue(e.target.value)}
                      placeholder="e.g. Sprint Backlog, System Architecture"
                      autoFocus
                      required
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPageToRename(null)}
                      className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRenaming || !renameInputValue.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      {isRenaming && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Save Title</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CUSTOM DELETE PAGE CONFIRMATION MODAL */}
        <AnimatePresence>
          {pageToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-foreground font-display">
                      Move Page to Trash?
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPageToDelete(null)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to move{" "}
                  <strong className="text-foreground font-semibold">
                    &ldquo;{pageToDelete.title}&rdquo;
                  </strong>{" "}
                  to the trash? It will be recoverable for 15 days before permanent auto-purge.
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPageToDelete(null)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleConfirmDelete}
                    className="inline-flex items-center gap-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Move to Trash</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
