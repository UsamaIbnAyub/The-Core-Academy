import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Get contact messages error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    const [msg] = await db
      .insert(contactMessages)
      .values({ name, email, subject: subject || null, message })
      .returning();

    return NextResponse.json({ message: msg }, { status: 201 });
  } catch (err) {
    console.error("Create contact message error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
