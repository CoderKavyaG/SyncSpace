"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Plus, LayoutGrid, Boxes, Layers, Terminal, Sparkles, Building2 } from "lucide-react";
import { toast } from "sonner";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newWorkspace: any) => void;
}

export function CreateWorkspaceDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateWorkspaceDialogProps) {
  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("building");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a workspace name.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          iconUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create workspace.");
        setIsLoading(false);
        return;
      }

      setName("");
      setIsLoading(false);
      toast.success(`Workspace "${data.name}" created successfully`);
      onSuccess(data);
      onClose();
    } catch (err) {
      console.error("Create workspace error:", err);
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elevated-lg z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold font-display text-foreground">
                  Create Workspace
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 text-xs rounded-lg border border-destructive/30 bg-destructive/10 text-destructive font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 font-body">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 font-display">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Engineering, Product Lab"
                  required
                  disabled={isLoading}
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background py-2.5 px-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 font-display">
                  Workspace Icon / Badge
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "building", label: "Building" },
                    { id: "boxes", label: "Boxes" },
                    { id: "layers", label: "Layers" },
                    { id: "terminal", label: "Terminal" },
                  ].map((icon) => (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => setIconUrl(icon.id)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                        iconUrl === icon.id
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20 text-primary"
                          : "border-border bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      {icon.id === "boxes" && <Boxes className="w-5 h-5" />}
                      {icon.id === "layers" && <Layers className="w-5 h-5" />}
                      {icon.id === "terminal" && <Terminal className="w-5 h-5" />}
                      {icon.id === "building" && <Building2 className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
