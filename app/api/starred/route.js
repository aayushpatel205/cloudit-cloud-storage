import { db } from "@/db/index";
import { NextResponse } from "next/server";
import { folders, starredFiles } from "@/db/schema"; // assuming your folders schema is here
import { eq, and, isNull } from "drizzle-orm";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const originalFileId = formData.get("originalFileId");
    const userId = formData.get("userId");
    const name = formData.get("fileName"); // ✅ Fix
    const size = formData.get("fileSize");
    const url = formData.get("fileUrl");
    const type = formData.get("fileType");

    console.log("UserId in starred", userId);

    if (!originalFileId || !userId) {
      return NextResponse.json(
        { error: "originalFileId and userId are required" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(starredFiles)
      .values({
        originalFileId,
        userId,
        name,
        size,
        url,
        type,
      })
      .returning();

    return NextResponse.json(
      { message: "Starred file added successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding starred file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const userStarredFiles = await db
      .select()
      .from(starredFiles)
      .where(eq(starredFiles.userId, userId));

    return NextResponse.json({ userStarredFiles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching starred files:", error);
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
    const originalFileId = searchParams.get("originalFileId");

    console.log("UserId in starred", userId);
    console.log("originalFileId in starred", originalFileId);

    if (!userId || !originalFileId) {
      return NextResponse.json(
        { error: "userId and originalFileId are required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(starredFiles)
      .where(
        and(
          eq(starredFiles.userId, userId),
          eq(starredFiles.originalFileId, originalFileId)
        )
      )
      .returning();

    return NextResponse.json(
      { message: "Starred file deleted successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting starred file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
