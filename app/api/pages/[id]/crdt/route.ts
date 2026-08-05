import { getCurrentUser, hasWorkspaceAccess } from "@/lib/auth-helpers";
import { apiError, apiSuccess, apiUnauthorized } from "@/lib/api-response";
import { db } from "@/lib/prisma";
import { uint8ArrayToBase64, base64ToUint8Array } from "@/lib/yjs-doc-manager";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/pages/:id/crdt
 * Retrieves the page's encoded binary Yjs CRDT snapshot and content summary.
 */
export async function GET(req: Request, { params }: Params) {
  try {
    const { id: pageId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const page = await db.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        workspaceId: true,
        yjsState: true,
        contentSummary: true,
      },
    });

    if (!page) {
      return apiError("Page not found", "NOT_FOUND", 404);
    }

    const canView = await hasWorkspaceAccess(user.id, page.workspaceId, "VIEWER");
    if (!canView) {
      return apiError("Forbidden: You do not have access to this page", "FORBIDDEN", 403);
    }

    const yjsBase64 = page.yjsState ? uint8ArrayToBase64(new Uint8Array(page.yjsState)) : null;

    return apiSuccess({
      pageId: page.id,
      yjsState: yjsBase64,
      contentSummary: page.contentSummary,
    });
  } catch (error) {
    console.error("GET /api/pages/[id]/crdt error:", error);
    return apiError("Failed to fetch CRDT state", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * POST /api/pages/:id/crdt
 * Persists a periodic binary Yjs snapshot to PostgreSQL bytea column + updates denormalized content summary.
 */
export async function POST(req: Request, { params }: Params) {
  try {
    const { id: pageId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const page = await db.page.findUnique({
      where: { id: pageId },
      select: { workspaceId: true },
    });

    if (!page) {
      return apiError("Page not found", "NOT_FOUND", 404);
    }

    const canEdit = await hasWorkspaceAccess(user.id, page.workspaceId, "EDITOR");
    if (!canEdit) {
      return apiError("Forbidden: Requires EDITOR role to persist updates", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const { yjsStateBase64, contentSummary } = body;

    if (!yjsStateBase64 || typeof yjsStateBase64 !== "string") {
      return apiError("Invalid Yjs state payload", "BAD_REQUEST", 400);
    }

    const binaryBuffer = Buffer.from(base64ToUint8Array(yjsStateBase64));

    await db.page.update({
      where: { id: pageId },
      data: {
        yjsState: binaryBuffer,
        ...(contentSummary !== undefined ? { contentSummary: String(contentSummary) } : {}),
      },
    });

    return apiSuccess({ message: "Yjs CRDT snapshot persisted successfully" });
  } catch (error) {
    console.error("POST /api/pages/[id]/crdt error:", error);
    return apiError("Failed to persist CRDT state", "INTERNAL_SERVER_ERROR", 500);
  }
}
