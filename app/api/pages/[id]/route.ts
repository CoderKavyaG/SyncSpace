import { getCurrentUser, hasWorkspaceAccess } from "@/lib/auth-helpers";
import { apiError, apiSuccess, apiUnauthorized } from "@/lib/api-response";
import { updatePageSchema } from "@/lib/validations";
import { archivePageCascade, getPageWithBlocks, updatePage } from "@/lib/page-service";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/pages/:id
 * Fetch single page with its ordered blocks.
 */
export async function GET(req: Request, { params }: Params) {
  try {
    const { id: pageId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const page = await getPageWithBlocks(pageId);
    if (!page) {
      return apiError("Page not found", "NOT_FOUND", 404);
    }

    const canView = await hasWorkspaceAccess(user.id, page.workspaceId, "VIEWER");
    if (!canView) {
      return apiError("Forbidden: You do not have access to this page", "FORBIDDEN", 403);
    }

    return apiSuccess(page);
  } catch (error) {
    console.error("GET /api/pages/[id] error:", error);
    return apiError("Failed to fetch page details", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * PATCH /api/pages/:id
 * Update title, icon, cover, parent page, or archive status. Requires EDITOR+ role.
 */
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id: pageId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const existingPage = await getPageWithBlocks(pageId);
    if (!existingPage) {
      return apiError("Page not found", "NOT_FOUND", 404);
    }

    const canEdit = await hasWorkspaceAccess(user.id, existingPage.workspaceId, "EDITOR");
    if (!canEdit) {
      return apiError("Forbidden: You require EDITOR role to modify this page", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const validation = updatePageSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        validation.error.issues[0]?.message || "Invalid page update payload",
        "BAD_REQUEST",
        400
      );
    }

    const updatedPage = await updatePage(pageId, validation.data);
    return apiSuccess(updatedPage);
  } catch (error) {
    console.error("PATCH /api/pages/[id] error:", error);
    return apiError("Failed to update page", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * DELETE /api/pages/:id
 * Soft deletes page (isArchived = true) and recursively cascades to all child pages.
 * Requires EDITOR+ role.
 */
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id: pageId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const existingPage = await getPageWithBlocks(pageId);
    if (!existingPage) {
      return apiError("Page not found", "NOT_FOUND", 404);
    }

    const canEdit = await hasWorkspaceAccess(user.id, existingPage.workspaceId, "EDITOR");
    if (!canEdit) {
      return apiError("Forbidden: You require EDITOR role to delete this page", "FORBIDDEN", 403);
    }

    await archivePageCascade(pageId);
    return apiSuccess({ message: "Page and child pages archived successfully", pageId });
  } catch (error) {
    console.error("DELETE /api/pages/[id] error:", error);
    return apiError("Failed to archive page", "INTERNAL_SERVER_ERROR", 500);
  }
}
