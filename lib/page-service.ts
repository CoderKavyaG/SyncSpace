import { db } from "@/lib/prisma";
import { buildPageTree, PageTreeNode } from "@/lib/page-tree-builder";

export async function createPage(
  workspaceId: string,
  createdById: string,
  data: { title?: string; icon?: string | null; parentPageId?: string | null }
) {
  return db.page.create({
    data: {
      title: data.title || "Untitled",
      icon: data.icon,
      parentPageId: data.parentPageId || null,
      workspaceId,
      createdById,
    },
  });
}

export async function getWorkspacePagesTree(
  workspaceId: string,
  includeArchived: boolean = false
): Promise<PageTreeNode[]> {
  const pages = await db.page.findMany({
    where: {
      workspaceId,
      ...(includeArchived ? {} : { isArchived: false }),
    },
    select: {
      id: true,
      title: true,
      icon: true,
      coverUrl: true,
      workspaceId: true,
      parentPageId: true,
      isArchived: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return buildPageTree(pages);
}

export async function getPageWithBlocks(pageId: string) {
  return db.page.findUnique({
    where: { id: pageId },
    include: {
      workspace: {
        select: { id: true, name: true, slug: true },
      },
      blocks: {
        orderBy: { order: "asc" },
      },
      createdBy: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });
}

export async function updatePage(
  pageId: string,
  data: {
    title?: string;
    icon?: string | null;
    coverUrl?: string | null;
    parentPageId?: string | null;
    isArchived?: boolean;
  }
) {
  return db.page.update({
    where: { id: pageId },
    data,
  });
}

/**
 * Soft deletes (archives) a page and recursively archives all of its child pages.
 */
export async function archivePageCascade(pageId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    // Helper recursive function to collect all nested child page IDs
    const getAllDescendantIds = async (id: string): Promise<string[]> => {
      const children = await tx.page.findMany({
        where: { parentPageId: id },
        select: { id: true },
      });

      let ids: string[] = [];
      for (const child of children) {
        ids.push(child.id);
        const nested = await getAllDescendantIds(child.id);
        ids = ids.concat(nested);
      }
      return ids;
    };

    const descendantIds = await getAllDescendantIds(pageId);
    const targetIds = [pageId, ...descendantIds];

    await tx.page.updateMany({
      where: { id: { in: targetIds } },
      data: { isArchived: true },
    });
  });
}
