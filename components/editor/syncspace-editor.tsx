"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  List,
  ListOrdered,
  Code,
  Table as TableIcon,
  Minus,
  Bold,
  Italic,
  Strikethrough,
  Code2,
  Link as LinkIcon,
  Sparkles,
  FileText,
  Loader2,
} from "lucide-react";
import { SyncSpaceYjsProvider, SyncState } from "@/lib/yjs-provider";
import { SyncStatusBadge } from "@/components/editor/sync-status-badge";
import { getUserPresenceColor } from "@/lib/presence-colors";

interface SyncSpaceEditorProps {
  pageId: string;
  userId: string;
  userName: string;
  userRole?: string;
  initialTitle?: string;
  initialBlocks?: any[];
  onTitleChange?: (newTitle: string) => void;
}

interface SlashMenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (editor: any) => void;
}

export function SyncSpaceEditor({
  pageId,
  userId,
  userName,
  userRole = "EDITOR",
  initialTitle = "Untitled",
  initialBlocks,
  onTitleChange,
}: SyncSpaceEditorProps) {
  const [provider, setProvider] = useState<SyncSpaceYjsProvider | null>(null);
  const [syncState, setSyncState] = useState<SyncState>("offline");

  useEffect(() => {
    const yjsProvider = new SyncSpaceYjsProvider({
      pageId,
      userId,
      onSyncStateChange: (state) => setSyncState(state),
    });

    setProvider(yjsProvider);

    return () => {
      yjsProvider.destroy();
    };
  }, [pageId, userId]);

  if (!provider || !provider.doc || !provider.awareness) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SyncSpaceEditorInner
      provider={provider}
      pageId={pageId}
      userId={userId}
      userName={userName}
      userRole={userRole}
      initialTitle={initialTitle}
      initialBlocks={initialBlocks}
      onTitleChange={onTitleChange}
      syncState={syncState}
    />
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function blocksToHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return "";
  return blocks
    .map((b) => {
      const text = b.content?.text || "";
      switch (b.type) {
        case "HEADING_1":
          return `<h1>${escapeHtml(text)}</h1>`;
        case "HEADING_2":
          return `<h2>${escapeHtml(text)}</h2>`;
        case "HEADING_3":
          return `<h3>${escapeHtml(text)}</h3>`;
        case "TODO":
          return `<ul data-type="taskList"><li data-type="taskItem" data-checked="${!!b.content?.checked}">${escapeHtml(text)}</li></ul>`;
        case "CODE":
          return `<pre><code>${escapeHtml(text)}</code></pre>`;
        case "CALLOUT":
          return `<blockquote><p>💡 ${escapeHtml(text)}</p></blockquote>`;
        case "DIVIDER":
          return `<hr />`;
        default:
          return `<p>${escapeHtml(text)}</p>`;
      }
    })
    .join("");
}

function SyncSpaceEditorInner({
  provider,
  pageId,
  userId,
  userName,
  userRole,
  initialTitle,
  initialBlocks,
  onTitleChange,
  syncState,
}: {
  provider: SyncSpaceYjsProvider;
  pageId: string;
  userId: string;
  userName: string;
  userRole: string;
  initialTitle: string;
  initialBlocks?: any[];
  onTitleChange?: (newTitle: string) => void;
  syncState: SyncState;
}) {
  const [title, setTitle] = useState(initialTitle);

  // Slash menu popover state
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });

  // Floating bubble toolbar state
  const [isBubbleMenuOpen, setIsBubbleMenuOpen] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });

  const isSlashMenuOpenRef = useRef(isSlashMenuOpen);
  const slashQueryRef = useRef(slashQuery);
  const slashIndexRef = useRef(slashIndex);

  useEffect(() => { isSlashMenuOpenRef.current = isSlashMenuOpen; }, [isSlashMenuOpen]);
  useEffect(() => { slashQueryRef.current = slashQuery; }, [slashQuery]);
  useEffect(() => { slashIndexRef.current = slashIndex; }, [slashIndex]);

  const userColor = getUserPresenceColor(userId);
  const isReadOnly = userRole === "VIEWER";

  // Initialize Tiptap Editor
  const editor = useEditor(
    {
      immediatelyRender: false,
      editable: !isReadOnly,
      extensions: [
        StarterKit.configure({
          undoRedo: false,
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableCell,
        TableHeader,
        Placeholder.configure({
          placeholder: "Type '/' for commands or start writing...",
        }),
        Collaboration.configure({
          document: provider.doc,
        }),
        CollaborationCaret.configure({
          provider: provider as any,
          user: {
            name: userName,
            color: userColor,
          },
        }),
      ],
      editorProps: {
        attributes: {
          class:
            "prose prose-invert max-w-none focus:outline-none min-h-[400px] text-foreground font-body leading-relaxed",
        },
        handleKeyDown: (view, event) => {
          if (event.key === "/") {
            const { selection } = view.state;
            const viewportCoords = view.coordsAtPos(selection.from);
            if (viewportCoords) {
              const editorElement = view.dom;
              const rect = editorElement.getBoundingClientRect();
              setSlashPosition({
                top: viewportCoords.top - rect.top + editorElement.scrollTop + 28,
                left: viewportCoords.left - rect.left,
              });
            }
            setIsSlashMenuOpen(true);
            setSlashQuery("");
            setSlashIndex(0);
          } else if (isSlashMenuOpenRef.current) {
            if (event.key === "Backspace") {
              const from = view.state.selection.from;
              const textBefore = view.state.doc.textBetween(Math.max(0, from - 1), from);
              if (textBefore === "/") {
                setIsSlashMenuOpen(false);
              } else {
                setSlashQuery((q) => q.slice(0, -1));
              }
            } else if (event.key === "Escape" || event.key === " ") {
              setIsSlashMenuOpen(false);
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter") {
              return true;
            } else if (event.key.length === 1) {
              setSlashQuery((q) => q + event.key);
            }
          }
          return false;
        },
      },
      onSelectionUpdate: ({ editor }) => {
        const { from, to } = editor.state.selection;
        if (from !== to) {
          const { selection } = editor.state;
          const viewportCoords = editor.view.coordsAtPos(selection.from);
          setBubblePosition({
            top: viewportCoords.top - 48,
            left: Math.max(viewportCoords.left, 20),
          });
          setIsBubbleMenuOpen(true);
        } else {
          setIsBubbleMenuOpen(false);
        }
      },
    },
    [provider]
  );

  // Seed initial blocks into empty Tiptap Yjs document
  useEffect(() => {
    if (!editor || !initialBlocks || initialBlocks.length === 0) return;
    const docText = editor.state.doc.textContent.trim();
    if (docText.length === 0 && editor.state.doc.childCount <= 1) {
      const html = blocksToHtml(initialBlocks);
      if (html) {
        editor.commands.setContent(html);
      }
    }
  }, [editor, initialBlocks]);

  // Available Slash Commands List
  const slashItems: SlashMenuItem[] = [
    {
      title: "Heading 1",
      description: "Large section title",
      icon: <Heading1 className="w-4 h-4 text-primary" />,
      command: (ed) => ed.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      title: "Heading 2",
      description: "Medium section header",
      icon: <Heading2 className="w-4 h-4 text-primary" />,
      command: (ed) => ed.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      title: "Heading 3",
      description: "Small subheader",
      icon: <Heading3 className="w-4 h-4 text-primary" />,
      command: (ed) => ed.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      title: "To-do List",
      description: "Track tasks with checkable checkboxes",
      icon: <CheckSquare className="w-4 h-4 text-secondary" />,
      command: (ed) => ed.chain().focus().toggleTaskList().run(),
    },
    {
      title: "Bulleted List",
      description: "Create a simple bulleted list",
      icon: <List className="w-4 h-4 text-secondary" />,
      command: (ed) => ed.chain().focus().toggleBulletList().run(),
    },
    {
      title: "Numbered List",
      description: "Create a ordered list with numbers",
      icon: <ListOrdered className="w-4 h-4 text-secondary" />,
      command: (ed) => ed.chain().focus().toggleOrderedList().run(),
    },
    {
      title: "Code Block",
      description: "Capture code snippets with syntax block",
      icon: <Code className="w-4 h-4 text-amber-400" />,
      command: (ed) => ed.chain().focus().toggleCodeBlock().run(),
    },
    {
      title: "Table",
      description: "Insert a 3x3 table",
      icon: <TableIcon className="w-4 h-4 text-purple-400" />,
      command: (ed) =>
        ed.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      title: "Divider",
      description: "Visually separate content blocks",
      icon: <Minus className="w-4 h-4 text-muted-foreground" />,
      command: (ed) => ed.chain().focus().setHorizontalRule().run(),
    },
  ];

  const filteredSlashItems = slashItems.filter((item) =>
    item.title.toLowerCase().includes(slashQuery.toLowerCase())
  );

  // Helper to delete "/" trigger and query, then run command
  const runSlashCommand = useCallback((item: SlashMenuItem) => {
    if (!editor) return;
    const { selection } = editor.state;
    const from = Math.max(0, selection.from - (slashQueryRef.current.length + 1));
    const to = selection.from;
    editor.chain().focus().deleteRange({ from, to }).run();
    item.command(editor);
    setIsSlashMenuOpen(false);
  }, [editor]);

  // Slash Menu Keyboard Navigation using refs to prevent stale closure bugs
  useEffect(() => {
    if (!isSlashMenuOpen) return;

    const handleSlashKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSlashMenuOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIndex((prev) => (prev < filteredSlashItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIndex((prev) => (prev > 0 ? prev - 1 : filteredSlashItems.length - 1));
      } else if (e.key === "Enter" && filteredSlashItems[slashIndexRef.current]) {
        e.preventDefault();
        runSlashCommand(filteredSlashItems[slashIndexRef.current]);
      }
    };

    window.addEventListener("keydown", handleSlashKeyDown);
    return () => window.removeEventListener("keydown", handleSlashKeyDown);
  }, [isSlashMenuOpen, filteredSlashItems, runSlashCommand]);

  // Click outside listener to close slash menu
  useEffect(() => {
    if (!isSlashMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".slash-menu-container")) {
        setIsSlashMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isSlashMenuOpen]);

  return (
    <div className="relative max-w-4xl mx-auto py-8 px-4 sm:px-8 font-body">
      {/* HEADER BAR: Document Icon, Title & Sync Status Badge */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setTitle(newTitle);
                if (onTitleChange) onTitleChange(newTitle);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("page-title-updated", {
                      detail: { pageId, title: newTitle },
                    })
                  );
                }
              }}
              readOnly={isReadOnly}
              placeholder="Untitled"
              className="w-full bg-transparent text-3xl font-bold tracking-tight text-foreground font-display placeholder:text-muted-foreground/40 focus:outline-none"
            />
          </div>

          <SyncStatusBadge state={syncState} />
        </div>
      </div>

      <div className="border-t border-border/60 mb-6" />

      {/* EDITOR CANVAS */}
      <div className="relative min-h-[500px]">
        <EditorContent editor={editor} />

        {/* FLOATING SLASH COMMAND MENU */}
        <AnimatePresence>
          {isSlashMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: `${slashPosition.top}px`,
                left: `${slashPosition.left}px`,
              }}
              className="slash-menu-container z-50 w-72 rounded-xl border border-border bg-white dark:bg-[#16191E] text-slate-900 dark:text-slate-100 p-1.5 shadow-2xl backdrop-blur-none"
            >
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
                Basic Blocks
              </div>
              <div className="max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar">
                {filteredSlashItems.length > 0 ? (
                  filteredSlashItems.map((item, index) => {
                    const isSelected = index === slashIndex;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => {
                          runSlashCommand(item);
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                            : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-border bg-slate-50 dark:bg-slate-900">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-3 text-xs text-center text-slate-500 dark:text-slate-400">
                    No matching block type
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING SELECTION BUBBLE TOOLBAR */}
        <AnimatePresence>
          {isBubbleMenuOpen && editor && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              style={{
                position: "fixed",
                top: `${bubblePosition.top}px`,
                left: `${bubblePosition.left}px`,
              }}
              className="z-50 flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-elevated-lg"
            >
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-accent/50 ${
                  editor.isActive("bold") ? "bg-primary/20 text-primary" : "text-muted-foreground"
                }`}
                title="Bold (⌘+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-accent/50 ${
                  editor.isActive("italic") ? "bg-primary/20 text-primary" : "text-muted-foreground"
                }`}
                title="Italic (⌘+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded hover:bg-accent/50 ${
                  editor.isActive("strike") ? "bg-primary/20 text-primary" : "text-muted-foreground"
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-1.5 rounded hover:bg-accent/50 ${
                  editor.isActive("code") ? "bg-primary/20 text-primary" : "text-muted-foreground"
                }`}
                title="Inline Code"
              >
                <Code2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
