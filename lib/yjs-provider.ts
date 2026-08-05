import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import * as awarenessProtocol from "y-protocols/awareness";

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

  constructor(options: SyncProviderOptions) {
    const { pageId, userId, wsUrl = "ws://localhost:1234", onSyncStateChange } = options;

    this.doc = new Y.Doc({ guid: pageId });
    this.awareness = new awarenessProtocol.Awareness(this.doc);
    this.onSyncStateChange = onSyncStateChange;

    // 1. Initialize IndexedDB Persistence for Instant Offline Editing
    this.indexeddbProvider = new IndexeddbPersistence(pageId, this.doc);

    this.indexeddbProvider.on("synced", () => {
      console.log(`[SyncSpaceYjsProvider] IndexedDB local cache hydrated for page ${pageId}`);
      if (this.syncState === "offline") {
        this.updateSyncState("synced");
      }
    });

    // 2. Connect to WebSocket Sync Server
    this.connectWebSocket(wsUrl, pageId, userId);
  }

  private updateSyncState(newState: SyncState) {
    this.syncState = newState;
    if (this.onSyncStateChange) {
      this.onSyncStateChange(newState);
    }
  }

  private connectWebSocket(wsUrl: string, pageId: string, userId: string) {
    if (this.isDestroyed) return;

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

      // Outbound updates from local edits
      this.doc.on("update", (update: Uint8Array, origin: any) => {
        if (origin === this) return; // Ignore updates that came from WebSocket itself

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
        this.updateSyncState("offline");
        this.scheduleReconnect(wsUrl, pageId, userId);
      };

      this.ws.onerror = (err) => {
        console.warn("[SyncSpaceYjsProvider] WebSocket error / network retry:", err);
        this.updateSyncState("offline");
      };
    } catch (err) {
      console.warn("[SyncSpaceYjsProvider] Failed to open WebSocket:", err);
      this.updateSyncState("offline");
      this.scheduleReconnect(wsUrl, pageId, userId);
    }
  }

  private scheduleReconnect(wsUrl: string, pageId: string, userId: string) {
    if (this.isDestroyed) return;

    // Exponential Backoff Reconnection Logic: 1s, 2s, 4s, 8s, max 30s
    this.reconnectAttempts++;
    const backoffMs = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);

    console.log(`[SyncSpaceYjsProvider] Reconnecting in ${backoffMs}ms (Attempt ${this.reconnectAttempts})...`);

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.reconnectTimer = setTimeout(() => {
      this.connectWebSocket(wsUrl, pageId, userId);
    }, backoffMs);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.indexeddbProvider.destroy();
  }
}
