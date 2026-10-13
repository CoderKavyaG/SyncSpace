import * as dotenv from "dotenv";
dotenv.config();

import { WebSocketServer, WebSocket } from "ws";
import * as http from "http";
import * as Y from "yjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.SYNC_SERVER_PORT ? parseInt(process.env.SYNC_SERVER_PORT, 10) : 1234;

interface ClientSocket extends WebSocket {
  pageId?: string;
  userId?: string;
  role?: string;
  isReadOnly?: boolean;
}

interface Room {
  doc: Y.Doc;
  clients: Set<ClientSocket>;
  saveTimeout: NodeJS.Timeout | null;
}

const rooms = new Map<string, Room>();

async function withDbRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      console.warn(`[SyncServer] Database operation failed, retrying (attempt ${attempt})...`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("DB Retry exceeded");
}

/**
 * Loads or initializes a Y.Doc room for a given pageId.
 */
async function getOrCreateRoom(pageId: string): Promise<Room> {
  if (rooms.has(pageId)) {
    return rooms.get(pageId)!;
  }

  const doc = new Y.Doc({ guid: pageId });
  const room: Room = {
    doc,
    clients: new Set(),
    saveTimeout: null,
  };

  // Load existing binary Yjs state from PostgreSQL bytea column if present
  try {
    const page = await withDbRetry(() =>
      prisma.page.findUnique({
        where: { id: pageId },
        select: { yjsState: true },
      })
    );

    if (page?.yjsState && page.yjsState.length > 0) {
      Y.applyUpdate(doc, new Uint8Array(page.yjsState));
      console.log(`[SyncServer] Loaded existing Yjs snapshot for page ${pageId}`);
    }
  } catch (err) {
    console.error(`[SyncServer] Error loading snapshot for page ${pageId}:`, err);
  }

  rooms.set(pageId, room);
  return room;
}

/**
 * Schedule debounced persistence of room Y.Doc state to PostgreSQL.
 */
function scheduleRoomSave(pageId: string, room: Room) {
  if (room.saveTimeout) {
    clearTimeout(room.saveTimeout);
  }

  room.saveTimeout = setTimeout(async () => {
    await persistRoomState(pageId, room);
  }, 2000);
}

/**
 * Persists current room Y.Doc state snapshot to PostgreSQL.
 */
async function persistRoomState(pageId: string, room: Room) {
  try {
    const stateUpdate = Y.encodeStateAsUpdate(room.doc);
    await withDbRetry(() =>
      prisma.page.update({
        where: { id: pageId },
        data: {
          yjsState: Buffer.from(stateUpdate),
        },
      })
    );
    console.log(`[SyncServer] Persisted Yjs snapshot to DB for page ${pageId}`);
  } catch (err) {
    console.error(`[SyncServer] Failed to persist snapshot for page ${pageId}:`, err);
  }
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("SyncSpace Real-Time WebSocket Relay Server Running");
});

const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket HTTP Upgrade Handshake
server.on("upgrade", async (request, socket, head) => {
  try {
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    const pageId = url.searchParams.get("pageId");
    const userId = url.searchParams.get("userId");

    if (!pageId || !userId) {
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      socket.destroy();
      return;
    }

    // Verify user role in page's workspace with retry
    const page = await withDbRetry(() =>
      prisma.page.findUnique({
        where: { id: pageId },
        select: { workspaceId: true },
      })
    );

    if (!page) {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.destroy();
      return;
    }

    const member = await withDbRetry(() =>
      prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: page.workspaceId,
            userId: userId,
          },
        },
        select: { role: true },
      })
    );

    if (!member) {
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws: ClientSocket) => {
      ws.pageId = pageId;
      ws.userId = userId;
      ws.role = member.role;
      ws.isReadOnly = member.role === "VIEWER";
      wss.emit("connection", ws, request);
    });
  } catch (err) {
    console.error("[SyncServer] Handshake upgrade error:", err);
    socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
    socket.destroy();
  }
});

wss.on("connection", async (ws: ClientSocket) => {
  const pageId = ws.pageId!;
  const room = await getOrCreateRoom(pageId);
  room.clients.add(ws);

  console.log(`[SyncServer] User ${ws.userId} (${ws.role}) joined room ${pageId}`);

  // Send initial server state vector diff to newly connected client
  const initialVector = Y.encodeStateAsUpdate(room.doc);
  if (initialVector.length > 0 && ws.readyState === WebSocket.OPEN) {
    const packet = new Uint8Array(initialVector.length + 1);
    packet[0] = 0; // Type: Sync
    packet.set(initialVector, 1);
    ws.send(packet);
  }

  // Handle incoming binary updates
  ws.on("message", (data: Buffer) => {
    const packet = new Uint8Array(data);
    const type = packet[0];
    const payload = packet.subarray(1);

    if (type === 0) {
      // SECURITY: Enforce RBAC write rejection for VIEWER connections
      if (ws.isReadOnly) {
        console.warn(`[SyncServer] SECURITY VIOLATION: Dropped write update from VIEWER user ${ws.userId}`);
        return;
      }

      try {
        // Merge update into room Y.Doc
        Y.applyUpdate(room.doc, payload, ws);

        // Broadcast update to all other room clients
        for (const client of room.clients) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
          }
        }

        // Schedule debounced database persistence
        scheduleRoomSave(pageId, room);
      } catch (err) {
        console.error("[SyncServer] Error processing update packet:", err);
      }
    } else if (type === 1) {
      // Broadcast awareness updates to other room clients
      for (const client of room.clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      }
    }
  });

  ws.on("close", async () => {
    room.clients.delete(ws);
    console.log(`[SyncServer] User ${ws.userId} left room ${pageId}`);

    // If last client disconnected from room, flush and persist immediately
    if (room.clients.size === 0) {
      if (room.saveTimeout) clearTimeout(room.saveTimeout);
      await persistRoomState(pageId, room);
      rooms.delete(pageId);
      console.log(`[SyncServer] Last client left room ${pageId}. Flushed snapshot and closed room.`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[SyncServer] Real-Time WebSocket Relay listening on ws://localhost:${PORT}`);
});
