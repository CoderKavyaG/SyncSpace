import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { apiError, apiSuccess, apiUnauthorized } from "@/lib/api-response";
import { db } from "@/lib/prisma";

/**
 * POST /api/workspaces/join
 * Join an existing workspace via workspace slug or workspace ID.
 */
export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return apiUnauthorized("Please sign in to join this workspace");
    }

    const body = await req.json();
    const { slugOrId } = body;

    if (!slugOrId || typeof slugOrId !== "string") {
      return apiError("Workspace identifier is required", "BAD_REQUEST", 400);
    }

    const query = slugOrId.trim();

    // Find workspace by slug or id
    const workspace = await db.workspace.findFirst({
      where: {
        OR: [{ id: query }, { slug: query }],
      },
      include: {
        _count: { select: { pages: true, members: true } },
      },
    });

    if (!workspace) {
      return apiError("Workspace not found with the provided link or ID", "NOT_FOUND", 404);
    }

    // Check if already a member
    const existingMembership = await db.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: currentUser.id,
        },
      },
    });

    if (existingMembership) {
      return apiSuccess({
        workspace,
        role: existingMembership.role,
        message: "You are already a member of this workspace",
      });
    }

    // Add user as an EDITOR
    const membership = await db.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: currentUser.id,
        role: "EDITOR",
      },
    });

    return apiSuccess({
      workspace,
      role: membership.role,
      message: `Successfully joined ${workspace.name}!`,
    });
  } catch (error) {
    console.error("POST /api/workspaces/join error:", error);
    return apiError("Failed to join workspace", "INTERNAL_SERVER_ERROR", 500);
  }
}

