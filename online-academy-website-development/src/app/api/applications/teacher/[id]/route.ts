import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { teacherApplications, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, adminNotes } = await req.json();

    const [application] = await db
      .update(teacherApplications)
      .set({
        status: status || undefined,
        adminNotes: adminNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(teacherApplications.id, parseInt(id)))
      .returning();

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // If approved, upgrade user role to teacher
    if (status === "approved" && application.applicantId) {
      await db
        .update(users)
        .set({ role: "teacher" })
        .where(eq(users.id, application.applicantId));
    }

    return NextResponse.json({ application });
  } catch (err) {
    console.error("Update teacher application error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
