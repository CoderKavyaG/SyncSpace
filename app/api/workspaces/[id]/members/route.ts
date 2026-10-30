import { NextResponse } from "next/server";
import { getCurrentUser, getWorkspaceRole } from "@/lib/auth-helpers";
import { apiError, apiSuccess, apiUnauthorized } from "@/lib/api-response";
import { db } from "@/lib/prisma";
import { Role } from "@prisma/client";

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/workspaces/:id/members
 * Retrieve full member roster for a workspace.
 */
export async function GET(req: Request, { params }: Params) {
  try {
    const { id: workspaceId } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return apiUnauthorized("Unauthorized");
    }

    const role = await getWorkspaceRole(currentUser.id, workspaceId);
    if (!role) {
      return apiError("Forbidden: You are not a member of this workspace", "FORBIDDEN", 403);
    }

    const members = await db.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    return apiSuccess(members);
  } catch (error) {
    console.error("GET /api/workspaces/[id]/members error:", error);
    return apiError("Failed to fetch workspace members", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * POST /api/workspaces/:id/members
 * Invite or add a new team member by email. Requires OWNER or EDITOR role.
 */
export async function POST(req: Request, { params }: Params) {
  try {
    const { id: workspaceId } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return apiUnauthorized("Unauthorized");
    }

    const currentRole = await getWorkspaceRole(currentUser.id, workspaceId);
    if (currentRole !== "OWNER" && currentRole !== "EDITOR") {
      return apiError("Forbidden: Requires EDITOR or OWNER role to invite members", "FORBIDDEN", 403);
    }

    const body = await req.json();
    const { email, role = "EDITOR" } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return apiError("Please provide a valid email address", "BAD_REQUEST", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if target user exists in database
    let targetUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    // If user does not exist yet, provision an invite placeholder user account
    if (!targetUser) {
      targetUser = await db.user.create({
        data: {
          email: normalizedEmail,
          name: normalizedEmail.split("@")[0],
          avatarUrl: null,
        },
      });
    }

    // Check if already a member
    const existingMembership = await db.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUser.id,
        },
      },
    });

    if (existingMembership) {
      return apiError("This user is already a member of this workspace", "CONFLICT", 409);
    }

    const targetRole: Role = role === "VIEWER" ? "VIEWER" : "EDITOR";

    const newMember = await db.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUser.id,
        role: targetRole,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return apiSuccess(newMember, 201);
  } catch (error) {
    console.error("POST /api/workspaces/[id]/members error:", error);
    return apiError("Failed to add workspace member", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * DELETE /api/workspaces/:id/members
 * Remove a member from the workspace. Requires OWNER role.
 */
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id: workspaceId } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return apiUnauthorized("Unauthorized");
    }

    const currentRole = await getWorkspaceRole(currentUser.id, workspaceId);
    if (currentRole !== "OWNER") {
      return apiError("Forbidden: Only the workspace OWNER can remove members", "FORBIDDEN", 403);
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return apiError("Member ID is required", "BAD_REQUEST", 400);
    }

    const targetMembership = await db.workspaceMember.findUnique({
      where: { id: memberId },
    });

    if (!targetMembership || targetMembership.workspaceId !== workspaceId) {
      return apiError("Membership record not found", "NOT_FOUND", 404);
    }

    if (targetMembership.userId === currentUser.id) {
      return apiError("Cannot remove yourself as workspace owner", "BAD_REQUEST", 400);
    }

    await db.workspaceMember.delete({
      where: { id: memberId },
    });

    return apiSuccess({ message: "Member removed successfully" });
  } catch (error) {
    console.error("DELETE /api/workspaces/[id]/members error:", error);
    return apiError("Failed to remove member", "INTERNAL_SERVER_ERROR", 500);
  }
}

