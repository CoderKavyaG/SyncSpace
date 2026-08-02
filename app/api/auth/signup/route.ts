import { NextResponse } from "next/server";
import hash from "bcryptjs";
import { db } from "@/lib/prisma";

import { getAvatarDataUri } from "@/lib/avatar-generator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Basic validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // 2. Password strength validation
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const sanitizedName = name.trim();

    // 3. Check for existing account
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // 4. Hash password
    const hashedPassword = await hash.hash(password, 10);

    // 5. Generate workspace slug
    const baseSlug = sanitizedName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const workspaceSlug = `${baseSlug || "personal"}-${randomSuffix}`;

    // 6. Create User, Workspace, WorkspaceMember, and initial Welcome Page in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create user with generated Notion aesthetic avatar
      const user = await tx.user.create({
        data: {
          name: sanitizedName,
          email: normalizedEmail,
          hashedPassword,
          avatarUrl: getAvatarDataUri(sanitizedName),
        },
      });

      // Auto-create initial personal workspace
      const workspace = await tx.workspace.create({
        data: {
          name: `${sanitizedName}'s Workspace`,
          slug: workspaceSlug,
          ownerId: user.id,
          iconUrl: "sparkles",
        },
      });

      // Create owner membership
      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          role: "OWNER",
        },
      });

      // Create initial Welcome Page inside workspace
      await tx.page.create({
        data: {
          title: "Getting Started with SyncSpace",
          icon: null,
          workspaceId: workspace.id,
          createdById: user.id,
          blocks: {
            create: [
              {
                type: "HEADING_1",
                order: 1.0,
                content: { text: "Welcome to your new workspace!" },
              },
              {
                type: "TEXT",
                order: 2.0,
                content: {
                  text: "SyncSpace is your local-first collaborative editor. Type / to bring up slash commands, create subpages in the sidebar, or customize your workspace.",
                },
              },
              {
                type: "TODO",
                order: 3.0,
                content: { text: "Explore page creation in the sidebar", checked: false },
              },
              {
                type: "TODO",
                order: 4.0,
                content: { text: "Try writing block content with slash commands", checked: false },
              },
            ],
          },
        },
      });

      return { user, workspace };
    });

    return NextResponse.json(
      {
        message: "Account and personal workspace created successfully.",
        userId: result.user.id,
        workspaceSlug: result.workspace.slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
