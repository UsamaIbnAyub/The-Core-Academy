import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses, users, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");

    let query = db
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
      .orderBy(desc(courses.createdAt));

    const results = await query;

    let filtered = results;
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (categoryId) filtered = filtered.filter((c) => c.categoryId === parseInt(categoryId));

    return NextResponse.json({ courses: filtered });
  } catch (err) {
    console.error("Get courses error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      shortDescription,
      categoryId,
      teacherId,
      fee,
      duration,
      level,
      thumbnail,
      status,
      classType,
      classLink,
      schedule,
      maxStudents,
      syllabus,
      requirements,
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const [course] = await db
      .insert(courses)
      .values({
        title,
        description,
        shortDescription: shortDescription || null,
        categoryId: categoryId ? parseInt(categoryId) : null,
        teacherId: teacherId ? parseInt(teacherId) : null,
        fee: fee || "0",
        duration: duration || null,
        level: level || "Beginner",
        thumbnail: thumbnail || null,
        status: status || "active",
        classType: classType || "google_meet",
        classLink: classLink || null,
        schedule: schedule || null,
        maxStudents: maxStudents ? parseInt(maxStudents) : 50,
        syllabus: syllabus || null,
        requirements: requirements || null,
      })
      .returning();

    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    console.error("Create course error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
