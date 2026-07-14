import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { teacherApplications, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");

    const results = await db
      .select({
        id: teacherApplications.id,
        proposedCourseTitle: teacherApplications.proposedCourseTitle,
        proposedCourseDescription: teacherApplications.proposedCourseDescription,
        qualifications: teacherApplications.qualifications,
        experience: teacherApplications.experience,
        classType: teacherApplications.classType,
        classLink: teacherApplications.classLink,
        proposedFee: teacherApplications.proposedFee,
        status: teacherApplications.status,
        adminNotes: teacherApplications.adminNotes,
        appliedAt: teacherApplications.appliedAt,
        applicantId: teacherApplications.applicantId,
        applicantName: users.name,
        applicantEmail: users.email,
        applicantPhone: users.phone,
      })
      .from(teacherApplications)
      .leftJoin(users, eq(teacherApplications.applicantId, users.id))
      .orderBy(desc(teacherApplications.appliedAt));

    if (session.role === "admin" && all === "true") {
      return NextResponse.json({ applications: results });
    }

    const filtered = results.filter((a) => a.applicantId === session.userId);
    return NextResponse.json({ applications: filtered });
  } catch (err) {
    console.error("Get teacher applications error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      proposedCourseTitle,
      proposedCourseDescription,
      qualifications,
      experience,
      classType,
      classLink,
      proposedFee,
    } = body;

    if (!proposedCourseTitle || !proposedCourseDescription || !qualifications) {
      return NextResponse.json(
        { error: "Course title, description, and qualifications are required" },
        { status: 400 }
      );
    }

    const [application] = await db
      .insert(teacherApplications)
      .values({
        applicantId: session.userId,
        proposedCourseTitle,
        proposedCourseDescription,
        qualifications,
        experience: experience || null,
        classType: classType || "google_meet",
        classLink: classLink || null,
        proposedFee: proposedFee || null,
      })
      .returning();

    return NextResponse.json({ application }, { status: 201 });
  } catch (err) {
    console.error("Create teacher application error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
