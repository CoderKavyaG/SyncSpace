import { getCurrentUser, getWorkspaceRole } from "@/lib/auth-helpers";
import { apiError, apiSuccess, apiUnauthorized } from "@/lib/api-response";
import { updateWorkspaceSchema } from "@/lib/validations";
import { getWorkspaceById, updateWorkspace } from "@/lib/workspace-service";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/workspaces/:id
 * Retrieve workspace details. Requires membership (VIEWER+).
 */
export async function GET(req: Request, { params }: Params) {
  try {
    const { id: workspaceId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const role = await getWorkspaceRole(user.id, workspaceId);
    if (!role) {
      return apiError("Forbidden: You are not a member of this workspace", "FORBIDDEN", 403);
    }

    const workspace = await getWorkspaceById(workspaceId);
    if (!workspace) {
      return apiError("Workspace not found", "NOT_FOUND", 404);
    }

    return apiSuccess({ ...workspace, userRole: role });
  } catch (error) {
    console.error("GET /api/workspaces/[id] error:", error);
    return apiError("Failed to fetch workspace", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * PATCH /api/workspaces/:id
 * Rename or update workspace icon. Requires OWNER role.
 */
export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id: workspaceId } = await params;
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const role = await getWorkspaceRole(user.id, workspaceId);
    if (role !== "OWNER") {
      return apiError(
        "Forbidden: Only the workspace owner can update workspace settings",
        "FORBIDDEN",
        403
      );
    }

    const body = await req.json();
    const validation = updateWorkspaceSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        validation.error.issues[0]?.message || "Invalid update payload",
        "BAD_REQUEST",
        400
      );
    }

    const updatedWorkspace = await updateWorkspace(workspaceId, validation.data);
    return apiSuccess(updatedWorkspace);
  } catch (error) {
    console.error("PATCH /api/workspaces/[id] error:", error);
    return apiError("Failed to update workspace", "INTERNAL_SERVER_ERROR", 500);
  }
}
