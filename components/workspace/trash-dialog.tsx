"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  X,
  FileText,
  Clock,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface TrashDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
  onPageRestored?: () => void;
}

interface TrashPageItem {
  id: string;
  title: string;
  updatedAt: string;
  daysRemaining: number;
  createdBy?: {
    name?: string;
    email?: string;
  };
}

export function TrashDialog({
  isOpen,
  onClose,
  workspaceId,
  onPageRestored,
}: TrashDialogProps) {
  const [trashPages, setTrashPages] = useState<TrashPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchTrash = async () => {
    if (!workspaceId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/pages/trash?workspaceId=${workspaceId}`);
      if (res.ok) {
        const json = await res.json();
        setTrashPages(json.data || []);
      }
    } catch (err) {
      console.error("Fetch trash error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && workspaceId) {
      fetchTrash();
    }
  }, [isOpen, workspaceId]);

  const handleRestore = async (pageId: string) => {
    setProcessingId(pageId);
    try {
      const res = await fetch("/api/pages/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", pageId }),
      });
      if (res.ok) {
        toast.success("Page restored to workspace");
        setTrashPages((prev) => prev.filter((p) => p.id !== pageId));
        if (onPageRestored) onPageRestored();
      } else {
        toast.error("Failed to restore page");
      }
    } catch (err) {
      toast.error("Error restoring page");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = async (pageId: string) => {
    if (!confirm("Are you sure? This will permanently delete the page and cannot be undone.")) return;
    setProcessingId(pageId);
    try {
      const res = await fetch("/api/pages/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_permanently", pageId }),
      });
      if (res.ok) {
        toast.success("Page permanently deleted");
        setTrashPages((prev) => prev.filter((p) => p.id !== pageId));
      } else {
        toast.error("Failed to delete page permanently");
      }
    } catch (err) {
      toast.error("Error permanently deleting page");
    } finally {
      setProcessingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-body antialiased">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-destructive/15 text-destructive border border-destructive/20">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground font-display">Trash Bin</h2>
              <p className="text-xs text-muted-foreground">
                Items are retained for 15 days before permanent auto-purge
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs">Loading trash items...</span>
            </div>
          ) : trashPages.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent/60 mx-auto flex items-center justify-center text-muted-foreground">
                <Trash2 className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-sm font-semibold text-foreground">Trash is empty</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Pages you delete will appear here and remain recoverable for 15 days.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {trashPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-background/60 hover:bg-accent/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold text-foreground font-display">
                        {page.title || "Untitled"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>{page.daysRemaining} days remaining</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <button
                      type="button"
                      disabled={processingId === page.id}
                      onClick={() => handleRestore(page.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-all cursor-pointer shadow-2xs"
                      title="Restore page to workspace"
                    >
                      <RotateCcw className="w-3 h-3 text-primary" />
                      <span>Restore</span>
                    </button>
                    <button
                      type="button"
                      disabled={processingId === page.id}
                      onClick={() => handlePermanentDelete(page.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>{trashPages.length} item{trashPages.length === 1 ? "" : "s"} in trash</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-accent text-foreground font-medium hover:bg-accent/80 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
