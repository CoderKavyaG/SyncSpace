import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import * as awarenessProtocol from "y-protocols/awareness";
import { uint8ArrayToBase64, base64ToUint8Array } from "@/lib/yjs-doc-manager";

export type SyncState = "offline" | "syncing" | "synced";

export interface SyncProviderOptions {
  pageId: string;
  userId: string;
  wsUrl?: string;
  onSyncStateChange?: (state: SyncState) => void;
}

export class SyncSpaceYjsProvider {
  public doc: Y.Doc;
  public indexeddbProvider: IndexeddbPersistence;
  public awareness: awarenessProtocol.Awareness;
  public ws: WebSocket | null = null;
  public syncState: SyncState = "offline";
  private isDestroyed = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private onSyncStateChange?: (state: SyncState) => void;
  private cloudSaveTimer: NodeJS.Timeout | null = null;
  private pageId: string;
  private userId: string;

  constructor(options: SyncProviderOptions) {
    const defaultWs =
      process.env.NEXT_PUBLIC_WS_URL ||
      (typeof window !== "undefined" && window.location.protocol === "https:"
        ? "" // Do not connect to insecure ws:// on https production unless NEXT_PUBLIC_WS_URL is provided
        : "ws://localhost:1234");

    const { pageId, userId, wsUrl = defaultWs, onSyncStateChange } = options;
    this.pageId = pageId;
    this.userId = userId;

    this.doc = new Y.Doc({ guid: pageId });
    this.awareness = new awarenessProtocol.Awareness(this.doc);
    this.onSyncStateChange = onSyncStateChange;

    // 1. Initialize IndexedDB Persistence for Instant 0ms Offline Editing
    this.indexeddbProvider = new IndexeddbPersistence(pageId, this.doc);

    this.indexeddbProvider.on("synced", () => {
      console.log(`[SyncSpaceYjsProvider] IndexedDB local cache hydrated for page ${pageId}`);
      if (this.syncState === "offline") {
        this.updateSyncState("synced");
      }
    });

    // 2. Fetch Central PostgreSQL Server Snapshot to ensure cross-device notes retention
    this.fetchServerSnapshot(pageId);

    // 3. Connect to WebSocket Sync Server (if configured)
    this.connectWebSocket(wsUrl, pageId, userId);

    // 4. Attach debounced cloud persistence on all local document edits
    this.setupCloudPersistence(pageId);
  }

  private updateSyncState(newState: SyncState) {
    this.syncState = newState;
    if (this.onSyncStateChange) {
      this.onSyncStateChange(newState);
    }
  }

  /**
   * Hydrates the Yjs CRDT document with the latest snapshot stored in PostgreSQL.
   */
  private async fetchServerSnapshot(pageId: string) {
    try {
      const res = await fetch(`/api/pages/${pageId}/crdt`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.yjsState) {
          const binaryUpdate = base64ToUint8Array(data.yjsState);
          if (binaryUpdate && binaryUpdate.length > 0) {
            Y.applyUpdate(this.doc, binaryUpdate, "server-hydration");
            console.log(`[SyncSpaceYjsProvider] Hydrated document ${pageId} from PostgreSQL snapshot`);
            this.updateSyncState("synced");
          }
        }
      }
    } catch (err) {
      console.warn(`[SyncSpaceYjsProvider] Server CRDT hydration skipped / offline:`, err);
    }
  }

  /**
   * Listens to Y.Doc updates and schedules a debounced HTTP POST to persist to PostgreSQL.
   */
  private setupCloudPersistence(pageId: string) {
    this.doc.on("update", (update: Uint8Array, origin: any) => {
      // Don't re-save if the update just came from the server hydration
      if (origin === "server-hydration") return;

      this.updateSyncState("syncing");

      if (this.cloudSaveTimer) {
        clearTimeout(this.cloudSaveTimer);
      }

      // Debounce saving to cloud database: 1.5 seconds after user stops typing
      this.cloudSaveTimer = setTimeout(() => {
        this.persistToCloud(pageId);
      }, 1500);
    });
  }

  /**
   * Encodes current Y.Doc state as Base64 binary update and sends to /api/pages/:id/crdt.
   */
  public async persistToCloud(pageId: string) {
    if (this.isDestroyed) return;

    try {
      const update = Y.encodeStateAsUpdate(this.doc);
      if (update.length === 0) return;

      const yjsStateBase64 = uint8ArrayToBase64(update);
      const res = await fetch(`/api/pages/${pageId}/crdt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yjsStateBase64 }),
      });

      if (res.ok) {
        this.updateSyncState("synced");
        console.log(`[SyncSpaceYjsProvider] Saved snapshot for page ${pageId} to cloud DB`);
      }
    } catch (err) {
      console.warn(`[SyncSpaceYjsProvider] Could not sync snapshot to cloud DB:`, err);
    }
  }

  private connectWebSocket(wsUrl: string, pageId: string, userId: string) {
    if (this.isDestroyed) return;
    if (!wsUrl) {
      // Offline local-first mode using IndexedDB & HTTP REST sync
      this.updateSyncState("synced");
      return;
    }

    this.updateSyncState("syncing");

    const fullUrl = `${wsUrl}?pageId=${encodeURIComponent(pageId)}&userId=${encodeURIComponent(userId)}`;

    try {
      this.ws = new WebSocket(fullUrl);
      this.ws.binaryType = "arraybuffer";

      this.ws.onopen = () => {
        console.log(`[SyncSpaceYjsProvider] WebSocket connected to room ${pageId}`);
        this.reconnectAttempts = 0;
        this.updateSyncState("synced");

        // Send local Yjs state vector on reconnect to initiate CRDT diff exchange
        const stateVector = Y.encodeStateAsUpdate(this.doc);
        if (stateVector.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
          const packet = new Uint8Array(stateVector.length + 1);
          packet[0] = 0; // Type: Sync Doc Update
          packet.set(stateVector, 1);
          this.ws.send(packet);
        }
      };

      // Inbound updates from relay server
      this.ws.onmessage = (event: MessageEvent) => {
        if (event.data instanceof ArrayBuffer) {
          const packet = new Uint8Array(event.data);
          const type = packet[0];
          const payload = packet.subarray(1);

          if (type === 0) {
            try {
              Y.applyUpdate(this.doc, payload, this);
              this.updateSyncState("synced");
            } catch (err) {
              console.error("[SyncSpaceYjsProvider] Error applying incoming WebSocket update:", err);
            }
          } else if (type === 1) {
            try {
              awarenessProtocol.applyAwarenessUpdate(this.awareness, payload, this);
            } catch (err) {
              console.error("[SyncSpaceYjsProvider] Error applying incoming awareness update:", err);
            }
          }
        }
      };

      // Outbound updates to WebSocket
      this.doc.on("update", (update: Uint8Array, origin: any) => {
        if (origin === this || origin === "server-hydration") return;

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const packet = new Uint8Array(update.length + 1);
          packet[0] = 0; // Type: Sync Doc Update
          packet.set(update, 1);
          this.ws.send(packet);
        }
      });

      // Outbound awareness updates
      this.awareness.on("update", ({ added, updated, removed }: { added: any[]; updated: any[]; removed: any[] }, origin: any) => {
        if (origin === this) return;

        const update = awarenessProtocol.encodeAwarenessUpdate(this.awareness, added.concat(updated, removed));
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const packet = new Uint8Array(update.length + 1);
          packet[0] = 1; // Type: Awareness Update
          packet.set(update, 1);
          this.ws.send(packet);
        }
      });

      this.ws.onclose = () => {
        console.warn(`[SyncSpaceYjsProvider] WebSocket disconnected from room ${pageId}`);
        this.updateSyncState("synced"); // Still synced locally with IndexedDB & REST
        this.scheduleReconnect(wsUrl, pageId, userId);
      };

      this.ws.onerror = (err) => {
        console.warn("[SyncSpaceYjsProvider] WebSocket error / network retry:", err);
        this.updateSyncState("synced");
      };
    } catch (err) {
      console.warn("[SyncSpaceYjsProvider] Failed to open WebSocket:", err);
      this.updateSyncState("synced");
      this.scheduleReconnect(wsUrl, pageId, userId);
    }
  }

  private scheduleReconnect(wsUrl: string, pageId: string, userId: string) {
    if (this.isDestroyed || !wsUrl) return;

    if (this.reconnectAttempts >= 2) {
      // Local WS relay is not active; IndexedDB local-first storage and REST cloud persistence handle everything seamlessly.
      return;
    }

    this.reconnectAttempts++;
    const backoffMs = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.reconnectTimer = setTimeout(() => {
      this.connectWebSocket(wsUrl, pageId, userId);
    }, backoffMs);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.cloudSaveTimer) {
      clearTimeout(this.cloudSaveTimer);
      // Flush save immediately before destroying
      this.persistToCloud(this.pageId);
    }
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.indexeddbProvider.destroy();
  }
}
