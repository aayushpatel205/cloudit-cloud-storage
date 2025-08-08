import { db } from "@/db/index";
import { NextResponse } from "next/server";
import { folders, trashedItems } from "@/db/schema"; // assuming your folders schema is here
import { eq, and, isNull } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const parentId = searchParams.get("parentId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const userTrashedItems = await db
      .select()
      .from(trashedItems)
      .where(and(eq(trashedItems.userId, userId)));

    return NextResponse.json({ userTrashedItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trashed items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const originalFileId = formData.get("originalFileId");
    const userId = formData.get("userId");
    const name = formData.get("fileName"); // ✅ Fix
    const size = formData.get("fileSize");
    const url = formData.get("fileUrl");
    const type = formData.get("fileType");
    const parentId = formData.get("parentId");

    console.log("UserId in starred", userId);

    if (!originalFileId || !userId) {
      return NextResponse.json(
        { error: "originalFileId and userId are required" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(trashedItems)
      .values({
        originalFileId,
        userId,
        name,
        size,
        url,
        type,
        parentId,
      })
      .returning();

    return NextResponse.json(
      { message: "File added to trash successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding file to trash", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const fileId = searchParams.get("fileId");

    if (!userId || !fileId) {
      return NextResponse.json(
        { error: "userId and originalFileId are required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(trashedItems)
      .where(and(eq(trashedItems.id, fileId), eq(trashedItems.userId, userId)))
      .returning();

    return NextResponse.json(
      { message: "File deleted successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
