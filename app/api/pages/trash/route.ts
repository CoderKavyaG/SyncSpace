import { NextResponse } from "next/server";
import { getCurrentUser, hasWorkspaceAccess } from "@/lib/auth-helpers";
import { apiError, apiSuccess, apiUnauthorized } from "@/lib/api-response";
import { db } from "@/lib/prisma";

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

/**
 * GET /api/pages/trash?workspaceId=...
 * Lists soft-deleted pages, auto-purging pages older than 15 days.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return apiError("workspaceId query parameter is required", "BAD_REQUEST", 400);
    }

    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const canView = await hasWorkspaceAccess(user.id, workspaceId, "VIEWER");
    if (!canView) {
      return apiError("Forbidden: You do not have access to this workspace", "FORBIDDEN", 403);
    }

    // 1. Auto-purge pages that were deleted > 15 days ago
    const fifteenDaysAgo = new Date(Date.now() - FIFTEEN_DAYS_MS);
    await db.page.deleteMany({
      where: {
        workspaceId,
        isArchived: true,
        updatedAt: {
          lt: fifteenDaysAgo,
        },
      },
    });

    // 2. Fetch remaining archived pages within 15-day window
    const trashPages = await db.page.findMany({
      where: {
        workspaceId,
        isArchived: true,
      },
      select: {
        id: true,
        title: true,
        icon: true,
        updatedAt: true,
        createdAt: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Calculate days remaining for each page
    const formattedPages = trashPages.map((page) => {
      const msSinceDelete = Date.now() - new Date(page.updatedAt).getTime();
      const msRemaining = Math.max(0, FIFTEEN_DAYS_MS - msSinceDelete);
      const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));

      return {
        ...page,
        daysRemaining,
      };
    });

    return apiSuccess(formattedPages);
  } catch (error) {
    console.error("GET /api/pages/trash error:", error);
    return apiError("Failed to fetch trash pages", "INTERNAL_SERVER_ERROR", 500);
  }
}

/**
 * POST /api/pages/trash
 * Actions: { action: "restore" | "delete_permanently", pageId: string }
 */
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return apiUnauthorized("Unauthorized");
    }

    const body = await req.json();
    const { action, pageId } = body;

    if (!pageId || !action) {
      return apiError("pageId and action are required", "BAD_REQUEST", 400);
    }

    const page = await db.page.findUnique({
      where: { id: pageId },
    });

    if (!page) {
      return apiError("Page not found in trash", "NOT_FOUND", 404);
    }

    const canEdit = await hasWorkspaceAccess(user.id, page.workspaceId, "EDITOR");
    if (!canEdit) {
      return apiError("Forbidden: You require EDITOR role to modify trash", "FORBIDDEN", 403);
    }

    if (action === "restore") {
      const restored = await db.page.update({
        where: { id: pageId },
        data: {
          isArchived: false,
          updatedAt: new Date(),
        },
      });
      return apiSuccess({ message: "Page restored successfully", page: restored });
    } else if (action === "delete_permanently") {
      await db.page.delete({
        where: { id: pageId },
      });
      return apiSuccess({ message: "Page permanently deleted" });
    }

    return apiError("Invalid action", "BAD_REQUEST", 400);
  } catch (error) {
    console.error("POST /api/pages/trash error:", error);
    return apiError("Failed to process trash action", "INTERNAL_SERVER_ERROR", 500);
  }
}
