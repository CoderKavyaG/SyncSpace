import * as Y from "yjs";

export interface YjsDocManagerOptions {
  pageId: string;
  initialYjsState?: Uint8Array | null;
}

/**
 * Utility to convert Uint8Array binary state to Base64 string for JSON transfer.
 */
export function uint8ArrayToBase64(array: Uint8Array): string {
  let binary = "";
  const len = array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(array[i]);
  }
  return btoa(binary);
}

/**
 * Utility to convert Base64 string back to Uint8Array.
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates and initializes a Y.Doc instance for a given page.
 */
export function createPageYjsDoc(pageId: string, initialYjsState?: Uint8Array | null): Y.Doc {
  const doc = new Y.Doc({ guid: pageId });

  if (initialYjsState && initialYjsState.length > 0) {
    try {
      Y.applyUpdate(doc, initialYjsState);
    } catch (err) {
      console.error(`Failed to apply binary Yjs state to page ${pageId}:`, err);
    }
  }

  return doc;
}

/**
 * Encodes the entire Y.Doc state as a binary Uint8Array update.
 */
export function encodeYjsState(doc: Y.Doc): Uint8Array {
  return Y.encodeStateAsUpdate(doc);
}

/**
 * In-Memory Local Sync Bridge for testing multi-client CRDT merge within the browser.
 */
export class InMemorySyncBridge {
  private docs = new Map<string, Y.Doc[]>();

  public register(pageId: string, doc: Y.Doc) {
    if (!this.docs.has(pageId)) {
      this.docs.set(pageId, []);
    }
    const pageDocs = this.docs.get(pageId)!;
    if (!pageDocs.includes(doc)) {
      pageDocs.push(doc);
    }

    // Listen for updates on this doc and broadcast to all other registered docs for this pageId
    doc.on("update", (update: Uint8Array, origin: any) => {
      if (origin === this) return; // Prevent infinite sync loops

      const siblings = this.docs.get(pageId) || [];
      for (const sibling of siblings) {
        if (sibling !== doc) {
          Y.applyUpdate(sibling, update, this);
        }
      }
    });
  }

  public unregister(pageId: string, doc: Y.Doc) {
    const pageDocs = this.docs.get(pageId);
    if (pageDocs) {
      this.docs.set(
        pageId,
        pageDocs.filter((d) => d !== doc)
      );
    }
  }
}

export const globalInMemoryBridge = new InMemorySyncBridge();
