import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { announcements } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(announcements).where(eq(announcements.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete announcement error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
