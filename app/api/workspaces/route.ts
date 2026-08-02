import { getCurrentUser } from "@/lib/auth-helpers";
import { apiError, apiSuccess, apiUnauthorized } from "@/lib/api-response";
import { createWorkspaceSchema } from "@/lib/validations";
import { createWorkspace, getUserWorkspaces } from "@/lib/workspace-service";

/**
 * GET /api/workspaces
 * List all workspaces the current user is a member of.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const workspaces = await getUserWorkspaces(user.id);
    return apiSuccess(workspaces);
  } catch (error) {
    console.error("GET /api/workspaces error:", error);
    return apiError("Failed to fetch workspaces", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * POST /api/workspaces
 * Create a new workspace. Requester becomes OWNER.
 */
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const body = await req.json();
    const validation = createWorkspaceSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        validation.error.issues[0]?.message || "Invalid workspace payload",
        "BAD_REQUEST",
        400
      );
    }

    const workspace = await createWorkspace(
      user.id,
      validation.data.name,
      validation.data.iconUrl
    );

    return apiSuccess(workspace, 201);
  } catch (error) {
    console.error("POST /api/workspaces error:", error);
    return apiError("Failed to create workspace", "INTERNAL_SERVER_ERROR", 500);
  }
}
