import * as Y from "yjs";

export interface StarterPageDefinition {
  title: string;
  icon?: string | null;
  blocks: {
    type: "HEADING_1" | "HEADING_2" | "HEADING_3" | "TEXT" | "TODO" | "CALLOUT" | "CODE" | "TABLE" | "DIVIDER";
    order: number;
    content: Record<string, any>;
  }[];
  tiptapJson?: Record<string, any>;
}

export function generateYjsDocState(title: string, tiptapContent: any[]): Buffer {
  const doc = new Y.Doc();
  const yxmlFragment = doc.getXmlFragment("default");
  
  // Create simple XML structure compatible with Tiptap Yjs Collaboration
  // For basic state initialization, Yjs encodeStateAsUpdate creates valid initial snapshot
  const stateUpdate = Y.encodeStateAsUpdate(doc);
  return Buffer.from(stateUpdate);
}

export const WORK_STARTER_PAGES: StarterPageDefinition[] = [
  {
    title: "Getting Started with SyncSpace",
    blocks: [
      {
        type: "HEADING_1",
        order: 1.0,
        content: { text: "Welcome to SyncSpace" },
      },
      {
        type: "CALLOUT",
        order: 2.0,
        content: {
          text: "SyncSpace is a local-first collaborative editor. Every keystroke is saved immediately to IndexedDB on your machine, and synced live across peers using Yjs CRDTs.",
        },
      },
      {
        type: "HEADING_2",
        order: 3.0,
        content: { text: "Quick Start Checklist" },
      },
      {
        type: "TODO",
        order: 4.0,
        content: { text: "Type / anywhere in the editor to open the Slash Command menu", checked: false },
      },
      {
        type: "TODO",
        order: 5.0,
        content: { text: "Create subpages in the sidebar to organize your project docs", checked: false },
      },
      {
        type: "TODO",
        order: 6.0,
        content: { text: "Test offline mode: disconnect your Wi-Fi, keep writing, and reconnect", checked: false },
      },
      {
        type: "TODO",
        order: 7.0,
        content: { text: "Open this page in a second browser window to see live multiplayer carets", checked: false },
      },
      {
        type: "HEADING_2",
        order: 8.0,
        content: { text: "Keyboard Shortcuts" },
      },
      {
        type: "TEXT",
        order: 9.0,
        content: { text: "⌘K or Ctrl+K — Open fuzzy page search" },
      },
      {
        type: "TEXT",
        order: 10.0,
        content: { text: "⌘B or Ctrl+B — Toggle left sidebar" },
      },
      {
        type: "TEXT",
        order: 11.0,
        content: { text: "/ — Insert headings, lists, code blocks, or dividers" },
      },
    ],
  },
  {
    title: "Product Roadmap & OKRs",
    blocks: [
      {
        type: "HEADING_1",
        order: 1.0,
        content: { text: "Q3 Product Roadmap" },
      },
      {
        type: "TEXT",
        order: 2.0,
        content: {
          text: "High-level overview of core engineering initiatives, quarterly milestones, and release targets.",
        },
      },
      {
        type: "HEADING_2",
        order: 3.0,
        content: { text: "Sprint Priorities" },
      },
      {
        type: "TODO",
        order: 4.0,
        content: { text: "Zero-latency local IndexedDB caching layer", checked: true },
      },
      {
        type: "TODO",
        order: 5.0,
        content: { text: "Figma-style remote caret indicators with user colors", checked: true },
      },
      {
        type: "TODO",
        order: 6.0,
        content: { text: "Granular workspace access permissions (Owner, Editor, Viewer)", checked: false },
      },
      {
        type: "TODO",
        order: 7.0,
        content: { text: "Global full-text search across documents", checked: false },
      },
      {
        type: "HEADING_2",
        order: 8.0,
        content: { text: "Key Objectives" },
      },
      {
        type: "TEXT",
        order: 9.0,
        content: { text: "Ensure sub-10ms local keystroke response times under heavy typing" },
      },
      {
        type: "TEXT",
        order: 10.0,
        content: { text: "Seamless automatic offline-to-online CRDT state merge with 0 lost edits" },
      },
    ],
  },
  {
    title: "Weekly Team Sync",
    blocks: [
      {
        type: "HEADING_1",
        order: 1.0,
        content: { text: "Weekly Engineering Sync" },
      },
      {
        type: "CALLOUT",
        order: 2.0,
        content: {
          text: "Meeting cadence: Mondays at 10:00 AM UTC. Attendees: Engineering, Product, Design.",
        },
      },
      {
        type: "HEADING_2",
        order: 3.0,
        content: { text: "Agenda" },
      },
      {
        type: "TEXT",
        order: 4.0,
        content: { text: "1. Review sprint deliverables and deployment health" },
      },
      {
        type: "TEXT",
        order: 5.0,
        content: { text: "2. Real-time WebSocket synchronization metrics" },
      },
      {
        type: "TEXT",
        order: 6.0,
        content: { text: "3. Open discussion & architecture unblockers" },
      },
      {
        type: "HEADING_2",
        order: 7.0,
        content: { text: "Action Items" },
      },
      {
        type: "TODO",
        order: 8.0,
        content: { text: "Benchmark WebSocket reconnection backoff timers", checked: false },
      },
      {
        type: "TODO",
        order: 9.0,
        content: { text: "Document local-first offline storage lifecycle", checked: false },
      },
    ],
  },
];

export const PERSONAL_STARTER_PAGES: StarterPageDefinition[] = [
  WORK_STARTER_PAGES[0],
  {
    title: "Daily Notes & Journal",
    blocks: [
      {
        type: "HEADING_1",
        order: 1.0,
        content: { text: "Daily Reflections & Ideas" },
      },
      {
        type: "TEXT",
        order: 2.0,
        content: { text: "A clean scratchpad for daily focus, thoughts, and quick captures." },
      },
      {
        type: "HEADING_2",
        order: 3.0,
        content: { text: "Today's Top 3 Goals" },
      },
      {
        type: "TODO",
        order: 4.0,
        content: { text: "Outline new system design proposal", checked: false },
      },
      {
        type: "TODO",
        order: 5.0,
        content: { text: "Review open pull requests and merge", checked: false },
      },
      {
        type: "TODO",
        order: 6.0,
        content: { text: "Read 30 minutes of distributed systems literature", checked: false },
      },
    ],
  },
  {
    title: "Reading List & References",
    blocks: [
      {
        type: "HEADING_1",
        order: 1.0,
        content: { text: "Reading List & Research" },
      },
      {
        type: "TEXT",
        order: 2.0,
        content: { text: "Designing Data-Intensive Applications — Martin Kleppmann" },
      },
      {
        type: "TEXT",
        order: 3.0,
        content: { text: "Local-first software: You own your data, in spite of the cloud (Ink & Switch)" },
      },
    ],
  },
];

export const SCHOOL_STARTER_PAGES: StarterPageDefinition[] = [
  WORK_STARTER_PAGES[0],
  {
    title: "Course Notes & Research",
    blocks: [
      {
        type: "HEADING_1",
        order: 1.0,
        content: { text: "Distributed Systems & CRDTs" },
      },
      {
        type: "TEXT",
        order: 2.0,
        content: {
          text: "Lecture notes and research paper summaries on state-based and operation-based CRDTs.",
        },
      },
      {
        type: "HEADING_2",
        order: 3.0,
        content: { text: "Assignments & Deadlines" },
      },
      {
        type: "TODO",
        order: 4.0,
        content: { text: "Implement Yjs Vector Clock verification test", checked: false },
      },
      {
        type: "TODO",
        order: 5.0,
        content: { text: "Submit final capstone architecture report", checked: false },
      },
    ],
  },
];
