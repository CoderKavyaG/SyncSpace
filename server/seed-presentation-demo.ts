import * as dotenv from "dotenv";
dotenv.config();

import hash from "bcryptjs";
import { db } from "../lib/prisma";
import { getAvatarDataUri } from "../lib/avatar-generator";
import { getSchema } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { prosemirrorJSONToYDoc } from "y-prosemirror";
import * as Y from "yjs";

const schema = getSchema([
  StarterKit,
  TaskList,
  TaskItem,
  Table,
  TableRow,
  TableCell,
  TableHeader,
]);

function buildYjsState(docJson: any): any {
  const ydoc = prosemirrorJSONToYDoc(schema, docJson, "default");
  const stateUpdate = Y.encodeStateAsUpdate(ydoc);
  return Buffer.from(stateUpdate) as any;
}

async function seed() {
  console.log("🚀 Starting presentation demo seeding...");

  const demoPassword = "password123";
  const hashedPassword = await hash.hash(demoPassword, 10);

  // We will setup two accounts: demo@syncspace.io and kavya@syncspace.io (both with password123)
  const targetEmails = ["demo@syncspace.io", "kavya@syncspace.io"];

  for (const email of targetEmails) {
    const name = email.startsWith("kavya") ? "Kavya Goel" : "Kavya Goel (Demo)";

    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name,
          email,
          hashedPassword,
          avatarUrl: getAvatarDataUri(name),
        },
      });
      console.log(`Created user: ${email}`);
    } else {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          name,
          hashedPassword,
          avatarUrl: getAvatarDataUri(name),
        },
      });
      console.log(`Updated user password for: ${email}`);
    }

    // Find or create workspace
    let member = await db.workspaceMember.findFirst({
      where: { userId: user.id, role: "OWNER" },
      include: { workspace: true },
    });

    let workspaceId = member?.workspaceId;

    if (!workspaceId) {
      const workspace = await db.workspace.create({
        data: {
          name: "SyncSpace HQ",
          slug: `syncspace-hq-${Math.random().toString(36).substring(2, 6)}`,
          ownerId: user.id,
          iconUrl: "sparkles",
        },
      });

      await db.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          role: "OWNER",
        },
      });

      workspaceId = workspace.id;
    } else {
      await db.workspace.update({
        where: { id: workspaceId },
        data: { name: "SyncSpace HQ" },
      });
    }

    // Clean existing pages for a fresh, crisp demo state
    await db.page.deleteMany({
      where: { workspaceId },
    });

    // PAGE 1: Product Roadmap & Architecture
    const roadmapJson = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "🚀 Product Roadmap & OKRs (Q3 / Q4)" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Welcome to SyncSpace HQ. This document outlines our core engineering architecture, quarterly milestones, and real-time collaboration engine deliverables.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Current Sprint Deliverables" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "0ms Keystroke Latency via ProseMirror local dispatch" }],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Client-side offline caching powered by IndexedDB (y-indexeddb)" }],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Yjs CRDT vector clock diffing for conflict-free state merge" }],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Figma-style multiplayer live carets & presence indicators" }],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "End-to-end encrypted peer-to-peer WebRTC mesh fallback" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Architectural Guarantees" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Every edit you make is instantly committed to your browser's local IndexedDB store. Even if your internet connection drops completely, you can continue typing without friction. The moment you reconnect, binary state vectors synchronize with the WebSocket relay server on port 1234 without a single conflict error.",
            },
          ],
        },
      ],
    };

    const roadmapPage = await db.page.create({
      data: {
        title: "Product Roadmap & OKRs",
        icon: "zap",
        workspaceId,
        createdById: user.id,
        isArchived: false,
        yjsState: buildYjsState(roadmapJson),
        blocks: {
          create: [
            { type: "HEADING_1", order: 1.0, content: { text: "Product Roadmap & OKRs (Q3 / Q4)" } },
            { type: "TEXT", order: 2.0, content: { text: "High-level overview of core engineering initiatives." } },
          ],
        },
      },
    });

    // PAGE 2: Local-First CRDT Deep Dive
    const crdtDocJson = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "⚡ Local-First & CRDT Replication Engine" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "SyncSpace is engineered around the Local-First software principles formalized by Martin Kleppmann and Ink & Switch. Unlike traditional Google Docs or cloud-first architectures that rely on server-authoritative locks, SyncSpace treats local data as the primary source of truth.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Core Technical Pillars" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "1. Zero Network Latency on Input: Keystrokes are rendered into the ProseMirror DOM in 0ms before any network packet is dispatched.",
                    },
                  ],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "2. Vector Clocks & State Deltas: Yjs encodes insertions as unique (client, clock) coordinates. Merges are commutative and associative.",
                    },
                  ],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "3. Debounced Snapshot Persistence: The WebSocket relay server aggregates concurrent updates and debounces PostgreSQL flushes to optimize database I/O.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Try This Live Demo" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Open this document in Chrome DevTools, toggle 'Offline' under the Network tab, write new content, and observe the status pill turn Offline. Turn the network back on, and watch it transition smoothly to Synced!",
            },
          ],
        },
      ],
    };

    await db.page.create({
      data: {
        title: "Local-First CRDT Deep Dive",
        icon: "hard-drive",
        workspaceId,
        createdById: user.id,
        isArchived: false,
        yjsState: buildYjsState(crdtDocJson),
        blocks: {
          create: [
            { type: "HEADING_1", order: 1.0, content: { text: "Local-First & CRDT Replication Engine" } },
          ],
        },
      },
    });

    // PAGE 3: Weekly Engineering Sync
    const syncDocJson = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "📅 Weekly Engineering Sync" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Cadence: Mondays at 10:00 AM UTC. Attendees: Kavya Goel, Frontend Team, Distributed Systems Team.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Meeting Agenda & Notes" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "WebSocket relay connection stability under high concurrency" }],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "IndexedDB transaction flushing performance benchmarks" }],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: false },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Live presentation demonstration rehearsal" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Action Items" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Demonstrate dual-window simultaneous typing and real-time cursor tracking to showcase CRDT determinism.",
            },
          ],
        },
      ],
    };

    await db.page.create({
      data: {
        title: "Weekly Team Sync",
        icon: "users",
        workspaceId,
        createdById: user.id,
        isArchived: false,
        yjsState: buildYjsState(syncDocJson),
        blocks: {
          create: [
            { type: "HEADING_1", order: 1.0, content: { text: "Weekly Engineering Sync" } },
          ],
        },
      },
    });

    // PAGE 4: Getting Started with SyncSpace
    const gettingStartedJson = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "✨ Getting Started with SyncSpace" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Welcome! Here is your quick cheat sheet of built-in shortcuts and capabilities:",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Power Shortcuts" }],
        },
        {
          type: "taskList",
          content: [
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Press Ctrl + K (or ⌘K) to open the global command palette & search" }],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Press Ctrl + B (or ⌘B) to collapse and expand the sidebar" }],
                },
              ],
            },
            {
              type: "taskItem",
              attrs: { checked: true },
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Type '/' anywhere in the editor to insert headings, checklists, code blocks, or tables" }],
                },
              ],
            },
          ],
        },
      ],
    };

    await db.page.create({
      data: {
        title: "Getting Started with SyncSpace",
        icon: "sparkles",
        workspaceId,
        createdById: user.id,
        isArchived: false,
        yjsState: buildYjsState(gettingStartedJson),
        blocks: {
          create: [
            { type: "HEADING_1", order: 1.0, content: { text: "Getting Started with SyncSpace" } },
          ],
        },
      },
    });

    // PAGE 5: Soft-deleted page in Trash (15-day retention demo!)
    const trashDocJson = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "🗑️ Deprecated V1 Sync Protocol Notes" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Archived technical notes from our legacy REST polling architecture before transitioning to Yjs CRDTs.",
            },
          ],
        },
      ],
    };

    await db.page.create({
      data: {
        title: "Deprecated V1 Sync Protocol",
        icon: "trash",
        workspaceId,
        createdById: user.id,
        isArchived: true, // In Trash!
        yjsState: buildYjsState(trashDocJson),
        blocks: {
          create: [
            { type: "HEADING_1", order: 1.0, content: { text: "Deprecated V1 Sync Protocol" } },
          ],
        },
      },
    });

    console.log(`Seeded 5 demo pages (including 1 in Trash) for user ${email}`);
  }

  console.log("✅ Presentation demo seeding completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
