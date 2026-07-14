import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json({ categories: allCategories });
  } catch (err) {
    console.error("Get categories error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, icon, color } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [category] = await db
      .insert(categories)
      .values({ name, description: description || null, icon: icon || null, color: color || null })
      .returning();

    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("Create category error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
