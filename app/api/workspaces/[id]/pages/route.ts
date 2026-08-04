import { getCurrentUser, hasWorkspaceAccess } from "@/lib/auth-helpers";
import { apiError, apiSuccess, apiUnauthorized } from "@/lib/api-response";
import { createPageSchema } from "@/lib/validations";
import { createPage, getWorkspacePagesTree } from "@/lib/page-service";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/workspaces/:id/pages
 * Returns pre-nested page hierarchy tree JSON for the workspace sidebar.
 */
export async function GET(req: Request, { params }: Params) {
  try {
    const { id: workspaceId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const isMember = await hasWorkspaceAccess(user.id, workspaceId, "VIEWER");
    if (!isMember) {
      return apiError("Forbidden: You are not a member of this workspace", "FORBIDDEN", 403);
    }

    const { searchParams } = new URL(req.url);
    const includeArchived = searchParams.get("includeArchived") === "true";

    const tree = await getWorkspacePagesTree(workspaceId, includeArchived);
    return apiSuccess(tree);
  } catch (error) {
    console.error("GET /api/workspaces/[id]/pages error:", error);
    return apiError("Failed to fetch workspace pages", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * POST /api/workspaces/:id/pages
 * Create a page inside the workspace. Requires EDITOR+ role.
 */
export async function POST(req: Request, { params }: Params) {
  try {
    const { id: workspaceId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const canEdit = await hasWorkspaceAccess(user.id, workspaceId, "EDITOR");
    if (!canEdit) {
      return apiError(
        "Forbidden: You require EDITOR role to create pages in this workspace",
        "FORBIDDEN",
        403
      );
    }

    const body = await req.json();
    const validation = createPageSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        validation.error.issues[0]?.message || "Invalid page payload",
        "BAD_REQUEST",
        400
      );
    }

    const page = await createPage(workspaceId, user.id, validation.data);
    return apiSuccess(page, 201);
  } catch (error) {
    console.error("POST /api/workspaces/[id]/pages error:", error);
    return apiError("Failed to create page", "INTERNAL_SERVER_ERROR", 500);
  }
}
