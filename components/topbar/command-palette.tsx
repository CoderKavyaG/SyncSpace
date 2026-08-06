"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { PageTreeNode } from "@/lib/page-tree-builder";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PageTreeNode[];
  onSelectPage: (pageId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  pages,
  onSelectPage,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten nested pages array into flat search list
  const flattenPages = (nodeList: PageTreeNode[]): PageTreeNode[] => {
    let result: PageTreeNode[] = [];
    for (const node of nodeList) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenPages(node.children));
      }
    }
    return result;
  };

  const allPages = flattenPages(pages);
  const filteredPages = allPages.filter((p) =>
    (p.title || "Untitled").toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation & global Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredPages.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredPages.length - 1
        );
      } else if (e.key === "Enter" && filteredPages[selectedIndex]) {
        e.preventDefault();
        onSelectPage(filteredPages[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredPages, selectedIndex, onClose, onSelectPage]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 font-body">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-xl border border-border bg-card shadow-elevated-lg overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages by title..."
                autoFocus
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto p-2 custom-scrollbar">
              {filteredPages.length > 0 ? (
                filteredPages.map((page, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={page.id}
                      onClick={() => {
                        onSelectPage(page.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-muted-foreground">
                          <FileText className="w-3.5 h-3.5" />
                        </span>
                        <span className="truncate">{page.title || "Untitled"}</span>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] text-primary">
                          <span>Open</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No matching pages found for &quot;{query}&quot;
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Hint Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-background/50 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span><kbd className="font-mono">↑↓</kbd> Navigate</span>
                <span><kbd className="font-mono">↵</kbd> Select</span>
                <span><kbd className="font-mono">Esc</kbd> Close</span>
              </div>
              <span className="font-mono">SyncSpace Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
