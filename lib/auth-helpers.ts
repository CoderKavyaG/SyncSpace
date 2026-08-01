import { Role } from "@prisma/client";
import { db } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * Server-side helper to fetch the current authenticated session user.
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const dbUser = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });
    return dbUser;
  } catch (err) {
    console.error("getCurrentUser database check error:", err);
    return null;
  }
}

/**
 * Role-aware server helper to determine a user's permission role within a given workspace.
 * Queries the WorkspaceMember join table.
 *
 * @param userId - The ID of the authenticated user
 * @param workspaceId - The target workspace ID
 * @returns Role ("OWNER" | "EDITOR" | "VIEWER") or null if not a member
 */
export async function getWorkspaceRole(
  userId: string,
  workspaceId: string
): Promise<Role | null> {
  if (!userId || !workspaceId) return null;

  const member = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
    select: {
      role: true,
    },
  });

  return member?.role ?? null;
}

/**
 * Helper to check if a user has at least a specific minimum role level in a workspace.
 */
export async function hasWorkspaceAccess(
  userId: string,
  workspaceId: string,
  requiredRole: Role = "VIEWER"
): Promise<boolean> {
  const role = await getWorkspaceRole(userId, workspaceId);
  if (!role) return false;

  const roleHierarchy: Record<Role, number> = {
    OWNER: 3,
    EDITOR: 2,
    VIEWER: 1,
  };

  return roleHierarchy[role] >= roleHierarchy[requiredRole];
}
