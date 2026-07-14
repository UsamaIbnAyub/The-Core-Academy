import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studentApplications, courses, users, enrollments } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    let query = db
      .select({
        id: studentApplications.id,
        status: studentApplications.status,
        paymentStatus: studentApplications.paymentStatus,
        paymentProof: studentApplications.paymentProof,
        paymentMethod: studentApplications.paymentMethod,
        transactionId: studentApplications.transactionId,
        notes: studentApplications.notes,
        adminNotes: studentApplications.adminNotes,
        appliedAt: studentApplications.appliedAt,
        studentId: studentApplications.studentId,
        courseId: studentApplications.courseId,
        studentName: users.name,
        studentEmail: users.email,
        studentPhone: users.phone,
        courseTitle: courses.title,
        courseFee: courses.fee,
      })
      .from(studentApplications)
      .leftJoin(users, eq(studentApplications.studentId, users.id))
      .leftJoin(courses, eq(studentApplications.courseId, courses.id))
      .orderBy(desc(studentApplications.appliedAt));

    const results = await query;

    if (session.role === "admin" && all === "true") {
      return NextResponse.json({ applications: results });
    }

    const filtered = results.filter((a) => a.studentId === session.userId);
    return NextResponse.json({ applications: filtered });
  } catch (err) {
    console.error("Get student applications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, paymentMethod, transactionId, notes } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // Check if already applied
    const existing = await db
      .select()
      .from(studentApplications)
      .where(
        and(
          eq(studentApplications.studentId, session.userId),
          eq(studentApplications.courseId, parseInt(courseId))
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Already applied for this course" }, { status: 409 });
    }

    const [application] = await db
      .insert(studentApplications)
      .values({
        studentId: session.userId,
        courseId: parseInt(courseId),
        paymentMethod: paymentMethod || null,
        transactionId: transactionId || null,
        notes: notes || null,
        paymentStatus: transactionId ? "submitted" : "pending",
      })
      .returning();

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("Create student application error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
