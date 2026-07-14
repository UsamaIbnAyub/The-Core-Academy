import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, courses, enrollments, studentApplications } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [studentCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "student"));

    const [teacherCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "teacher"));

    const [courseCount] = await db.select({ count: count() }).from(courses);

    const [enrollmentCount] = await db.select({ count: count() }).from(enrollments);

    const [pendingApplications] = await db
      .select({ count: count() })
      .from(studentApplications)
      .where(eq(studentApplications.status, "pending"));

    return NextResponse.json({
      stats: {
        students: studentCount.count,
        teachers: teacherCount.count,
        courses: courseCount.count,
        enrollments: enrollmentCount.count,
        pendingApplications: pendingApplications.count,
      },
    });
  } catch (err) {
    console.error("Get stats error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
