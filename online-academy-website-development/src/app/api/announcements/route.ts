import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { announcements, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const all = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        content: announcements.content,
        isPublished: announcements.isPublished,
        isPinned: announcements.isPinned,
        createdAt: announcements.createdAt,
        authorName: users.name,
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.authorId, users.id))
      .where(eq(announcements.isPublished, true))
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt));

    return NextResponse.json({ announcements: all });
  } catch (err) {
    console.error("Get announcements error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, isPinned } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const [announcement] = await db
      .insert(announcements)
      .values({
        title,
        content,
        authorId: session.userId,
        isPinned: isPinned || false,
      })
      .returning();

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (err) {
    console.error("Create announcement error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
