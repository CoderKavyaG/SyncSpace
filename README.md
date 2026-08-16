# SyncSpace

> **The Next-Generation Local-First Real-Time Collaborative Workspace Engine**

SyncSpace is a modern collaborative workspace built on **Local-First Architecture**, **IndexedDB client-side persistence**, and **Yjs CRDT Conflict-Free Replication**. Designed for sub-millisecond typing speeds, offline resilience, and friction-free team collaboration.

---

## Visual Showcase

### 1. Where Modern Teams Write & Sync Together
![SyncSpace Hero Landing](public/screenshots/hero-banner.png)

### 2. Zero-Latency Collaborative Editor Canvas
![Product Roadmap & Architecture Editor](public/screenshots/editor-preview.png)

### 3. Workflows & Engineering Automations
![Keep work moving 24/7 with local-first sync](public/screenshots/workflows-section.png)

### 4. Workspace HQ, Teamspaces & Mid-Aligned Command Bar
![SyncSpace Dark Mode Workspace Canvas](public/screenshots/workspace-canvas.png)

---

## Key Features

- **0ms Keystroke Latency**: Every keypress executes locally in 0 milliseconds using ProseMirror transactions before broadcasting over the network.
- **100% Offline Resilience**: Write anywhere. Client-side IndexedDB persistence saves all document edits continuously without network dependency.
- **Conflict-Free CRDT Synchronization**: Peer-to-peer merge resolution with Yjs state vectors—zero lock conflicts and zero data loss upon reconnection.
- **Real-Time Multiplayer Carets**: Figma-style live presence indicators and cursor selections across all connected peers.
- **Teamspaces Folders & Page Tree**: Hierarchical nested document structure with dedicated folders for **Projects**, **Tasks**, **Meetings**, and **Docs**.
- **Real-Time Title Synchronization**: Renaming documents auto-updates the sidebar page tree and topbar breadcrumbs instantaneously without refreshing.
- **15-Day Trash Retention Bin**: Soft-deleted pages are retained with countdown timers, one-click recovery, and automated 15-day purge.
- **Notion-Style Aesthetics & Avatar Generation**: Deterministic illustrated avatar PFPs for users with custom border palettes.
- **Built-in Power Tools**: `/` Slash command menu, `⌘K` global quick find, `⌘B` sidebar collapse, and dark/light mode toggle.

---

## Architecture Overview

```
                                 [ Browser Client ]
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
         [ IndexedDB Persistence ]                 [ ProseMirror / Tiptap ]
         (Local 0ms Keystroke Cache)               (Block-level Document Model)
                    │                                         │
                    └────────────────────┬────────────────────┘
                                         ▼
                               [ Yjs CRDT Document ]
                            (Vector Clocks & Deltas)
                                         │
                                         ▼ (Binary WebSocket Updates)
                           [ Yjs Sync Server (Port 1234) ]
                                         │
                                         ▼ (State Snapshot Flush)
                          [ PostgreSQL Database (Prisma) ]
```

---

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) + React 19 + TypeScript
- **CRDT Engine**: [Yjs](https://yjs.dev/) + `y-websocket` + `y-indexeddb`
- **Rich-Text Editor**: [Tiptap](https://tiptap.dev/) + ProseMirror Collaboration Extensions
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Radix UI primitives + Lucide Icons + Framer Motion
- **Database & ORM**: PostgreSQL + [Prisma ORM](https://www.prisma.io/)
- **Authentication**: NextAuth.js (Auth.js) Credentials Flow with Bcrypt hashing

---

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- PostgreSQL database instance (or Docker)

### Installation

1. Clone repository:
```bash
git clone https://github.com/CoderKavyaG/SyncSpace.git
cd SyncSpace
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables (`.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/syncspace"
NEXTAUTH_SECRET="your-generated-jwt-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="ws://localhost:1234"
```

4. Run Prisma database migrations:
```bash
npx prisma db push
```

5. Start the development server and sync server:
```bash
# Terminal 1: Next.js frontend & API
npm run dev

# Terminal 2: Yjs real-time WebSocket sync server
npx ts-node --project tsconfig.server.json server/sync-server.ts
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

MIT License © 2026 SyncSpace Labs, Inc.
