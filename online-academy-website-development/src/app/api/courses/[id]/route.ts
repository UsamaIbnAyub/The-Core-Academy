import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses, users, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [course] = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        shortDescription: courses.shortDescription,
        fee: courses.fee,
        duration: courses.duration,
        level: courses.level,
        thumbnail: courses.thumbnail,
        status: courses.status,
        classType: courses.classType,
        classLink: courses.classLink,
        schedule: courses.schedule,
        maxStudents: courses.maxStudents,
        syllabus: courses.syllabus,
        requirements: courses.requirements,
        totalEnrolled: courses.totalEnrolled,
        createdAt: courses.createdAt,
        categoryId: courses.categoryId,
        teacherId: courses.teacherId,
        teacherName: users.name,
        teacherBio: users.bio,
        categoryName: categories.name,
      })
      .from(courses)
      .leftJoin(users, eq(courses.teacherId, users.id))
      .leftJoin(categories, eq(courses.categoryId, categories.id))
      .where(eq(courses.id, parseInt(id)))
      .limit(1);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (err) {
    console.error("Get course error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const [updated] = await db
      .update(courses)
      .set({
        title: body.title,
        description: body.description,
        shortDescription: body.shortDescription || null,
        categoryId: body.categoryId ? parseInt(body.categoryId) : null,
        teacherId: body.teacherId ? parseInt(body.teacherId) : null,
        fee: body.fee || "0",
        duration: body.duration || null,
        level: body.level || "Beginner",
        thumbnail: body.thumbnail || null,
        status: body.status || "active",
        classType: body.classType || "google_meet",
        classLink: body.classLink || null,
        schedule: body.schedule || null,
        maxStudents: body.maxStudents ? parseInt(body.maxStudents) : 50,
        syllabus: body.syllabus || null,
        requirements: body.requirements || null,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course: updated });
  } catch (err) {
    console.error("Update course error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(courses).where(eq(courses.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete course error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
