import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studentApplications, courses, enrollments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, paymentStatus, adminNotes } = body;

    const [application] = await db
      .update(studentApplications)
      .set({
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        adminNotes: adminNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(studentApplications.id, parseInt(id)))
      .returning();

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // If approved, create enrollment
    if (status === "approved" && paymentStatus === "verified" && application.courseId && application.studentId) {
      const existingEnrollment = await db
        .select()
        .from(enrollments)
        .where(eq(enrollments.applicationId, application.id))
        .limit(1);

      if (existingEnrollment.length === 0) {
        await db.insert(enrollments).values({
          studentId: application.studentId,
          courseId: application.courseId,
          applicationId: application.id,
        });

        // Update total enrolled count
        const [course] = await db
          .select()
          .from(courses)
          .where(eq(courses.id, application.courseId))
          .limit(1);

        if (course) {
          await db
            .update(courses)
            .set({ totalEnrolled: (course.totalEnrolled || 0) + 1 })
            .where(eq(courses.id, application.courseId));
        }
      }
    }

    return NextResponse.json({ application });
  } catch (err) {
    console.error("Update application error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
