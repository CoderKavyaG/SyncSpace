"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  FileText,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
  Copy,
  Edit2,
} from "lucide-react";
import { PageTreeNode } from "@/lib/page-tree-builder";

interface PageTreeItemProps {
  page: PageTreeNode;
  activePageId?: string | null;
  level?: number;
  onSelectPage: (pageId: string) => void;
  onCreateSubpage: (parentPageId: string) => void;
  onRenamePage: (pageId: string, currentTitle: string) => void;
  onDeletePage: (pageId: string) => void;
}

export function PageTreeItem({
  page,
  activePageId,
  level = 0,
  onSelectPage,
  onCreateSubpage,
  onRenamePage,
  onDeletePage,
}: PageTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hasChildren = page.children && page.children.length > 0;
  const isActive = page.id === activePageId;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };

  return (
    <div className="select-none font-body">
      {/* Page Row Item */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={handleContextMenu}
        className={`group relative flex items-center justify-between rounded-lg py-1.5 pr-2 text-xs transition-colors ${
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
        }`}
        style={{ paddingLeft: `${Math.max(level * 12 + 6, 6)}px` }}
      >
        {/* Left Section: Chevron + Drag Handle + Icon + Title */}
        <div
          onClick={() => onSelectPage(page.id)}
          className="flex min-w-0 flex-1 items-center gap-1.5 cursor-pointer"
        >
          {/* Drag Handle Indicator (Segment 2 stub) */}
          <div
            className={`cursor-grab text-muted-foreground/40 hover:text-muted-foreground transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            title="Drag to reorder"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Expand / Collapse Chevron */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className={`p-0.5 rounded text-muted-foreground hover:text-foreground transition-transform ${
              hasChildren ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${isExpanded ? "rotate-90" : ""}`}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Page Icon / Default Document Icon */}
          <span className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
            <FileText className="w-3.5 h-3.5" />
          </span>

          {/* Page Title */}
          <span className="truncate min-w-0 flex-1">{page.title || "Untitled"}</span>
        </div>

        {/* Right Hover Actions: + Subpage & Context Menu */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCreateSubpage(page.id);
              setIsExpanded(true);
            }}
            className={`p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            title="Add subpage"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Context Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-opacity ${
                isHovered || isMenuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Click-outside backdrop */}
            {isMenuOpen && (
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
                onContextMenu={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsMenuOpen(false);
                }}
              />
            )}

            {/* Dropdown / Right-Click Context Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-border/80 bg-[#16191E] dark:bg-[#16191E] bg-white p-1 shadow-2xl backdrop-blur-xl ring-1 ring-black/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onRenamePage(page.id, page.title);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-muted-foreground" />
                    <span>Rename</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onCreateSubpage(page.id);
                      setIsExpanded(true);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3 text-muted-foreground" />
                    <span>Add subpage</span>
                  </button>

                  <div className="my-1 border-t border-border/60" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDeletePage(page.id);
                    }}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Nested Children (Recursive) */}
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {page.children.map((child) => (
              <PageTreeItem
                key={child.id}
                page={child}
                activePageId={activePageId}
                level={level + 1}
                onSelectPage={onSelectPage}
                onCreateSubpage={onCreateSubpage}
                onRenamePage={onRenamePage}
                onDeletePage={onDeletePage}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
