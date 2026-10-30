import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ hasCompletedOnboarding: true });
    }

    const userRecord = await db.user.findUnique({
      where: { id: user.id },
      select: { hasCompletedOnboarding: true },
    });

    return NextResponse.json({
      hasCompletedOnboarding: Boolean(userRecord?.hasCompletedOnboarding),
    });
  } catch (error) {
    console.error("GET /api/onboarding/status error:", error);
    return NextResponse.json({ hasCompletedOnboarding: true });
  }
}

