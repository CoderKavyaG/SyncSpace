import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import {
  WORK_STARTER_PAGES,
  PERSONAL_STARTER_PAGES,
  SCHOOL_STARTER_PAGES,
  StarterPageDefinition,
} from "@/lib/starter-templates";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { workspaceName, useCase } = body;

    const trimmedName = typeof workspaceName === "string" && workspaceName.trim() ? workspaceName.trim() : null;
    const selectedUseCase = useCase || "work";

    // 1. Find user's existing default workspace or create one
    let memberRecord = await db.workspaceMember.findFirst({
      where: { userId: session.user.id, role: "OWNER" },
      include: { workspace: true },
    });

    let workspaceId = memberRecord?.workspaceId;

    if (memberRecord?.workspace && trimmedName) {
      // Update existing workspace name
      await db.workspace.update({
        where: { id: memberRecord.workspaceId },
        data: {
          name: trimmedName,
        },
      });
    } else if (!memberRecord) {
      // Create new workspace if not found
      const baseSlug = (trimmedName || session.user.name || "workspace")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const workspaceSlug = `${baseSlug || "space"}-${randomSuffix}`;

      const newWorkspace = await db.workspace.create({
        data: {
          name: trimmedName || `${session.user.name || "Personal"}'s Workspace`,
          slug: workspaceSlug,
          ownerId: session.user.id,
        },
      });

      await db.workspaceMember.create({
        data: {
          workspaceId: newWorkspace.id,
          userId: session.user.id,
          role: "OWNER",
        },
      });

      workspaceId = newWorkspace.id;
    }

    if (!workspaceId) {
      return NextResponse.json({ error: "Failed to initialize workspace" }, { status: 500 });
    }

    // 2. Select appropriate template bundle
    let templates: StarterPageDefinition[] = WORK_STARTER_PAGES;
    if (selectedUseCase === "personal") templates = PERSONAL_STARTER_PAGES;
    else if (selectedUseCase === "school") templates = SCHOOL_STARTER_PAGES;

    // 3. Clear existing default pages for this workspace and seed rich templates
    await db.page.deleteMany({
      where: { workspaceId: workspaceId },
    });

    // Seed templates in order
    for (const tpl of templates) {
      await db.page.create({
        data: {
          title: tpl.title,
          icon: tpl.icon || null,
          workspaceId: workspaceId,
          createdById: session.user.id,
          blocks: {
            create: tpl.blocks.map((b) => ({
              type: b.type,
              order: b.order,
              content: b.content,
            })),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      workspaceId,
      message: "Workspace customized and starter documents seeded.",
    });
  } catch (error) {
    console.error("Onboarding setup error:", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
