import { db } from "@/lib/prisma";

export async function createWorkspace(ownerId: string, name: string, iconUrl?: string | null) {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const slug = `${baseSlug || "workspace"}-${randomSuffix}`;

  return db.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name,
        slug,
        iconUrl,
        ownerId,
      },
    });

    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: ownerId,
        role: "OWNER",
      },
    });

    return workspace;
  });
}

export async function getUserWorkspaces(userId: string) {
  const memberships = await db.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: {
        include: {
          _count: {
            select: { pages: true, members: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return memberships.map((m) => ({
    ...m.workspace,
    role: m.role,
    pageCount: m.workspace._count.pages,
    memberCount: m.workspace._count.members,
  }));
}

export async function getWorkspaceById(workspaceId: string) {
  return db.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      owner: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      _count: {
        select: { pages: true },
      },
    },
  });
}

export async function updateWorkspace(
  workspaceId: string,
  data: { name?: string; iconUrl?: string | null }
) {
  return db.workspace.update({
    where: { id: workspaceId },
    data,
  });
}
