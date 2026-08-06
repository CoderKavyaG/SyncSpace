"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface EditorPlaceholderProps {
  page: any;
  isLoading: boolean;
  pageId: string;
}

export function PageWithBlocksPlaceholder({ page, isLoading }: EditorPlaceholderProps) {
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-8 animate-pulse font-body">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted/60" />
          <div className="h-8 w-1/2 rounded-lg bg-muted/60" />
        </div>
        <div className="space-y-3 pt-6">
          <div className="h-4 w-full rounded bg-muted/40" />
          <div className="h-4 w-5/6 rounded bg-muted/40" />
          <div className="h-4 w-3/4 rounded bg-muted/40" />
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-md mx-auto text-center py-20 text-muted-foreground font-body">
        <FileText className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-bold text-foreground font-display">Page Not Found</h3>
        <p className="text-xs mt-1">The page you are looking for does not exist or was deleted.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto pt-6 px-4 font-body"
    >
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
            {page.title || "Untitled"}
          </h1>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          Created by {page.createdBy?.name || "Member"} • Updated {new Date(page.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Blocks Preview List */}
      <div className="space-y-4">
        {page.blocks && page.blocks.length > 0 ? (
          page.blocks.map((block: any) => (
            <div
              key={block.id}
              className="p-3 rounded-lg border border-border/60 bg-card/40 text-sm text-foreground font-body leading-relaxed"
            >
              {block.content?.text || JSON.stringify(block.content)}
            </div>
          ))
        ) : (
          <div className="p-8 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
            Empty document canvas — ready for block editor implementation.
          </div>
        )}
      </div>
    </motion.div>
  );
}
