import { db } from "@/db/index";
import { NextResponse } from "next/server";
import { folders } from "@/db/schema"; // assuming your folders schema is here
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { folderName, userId, parentId } = await req.json();

    if (!folderName || !userId) {
      return NextResponse.json(
        { error: "folderName and userId are required" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(folders)
      .values({
        name: folderName,
        userId,
        parentId: parentId || null,
      })
      .returning();

    return NextResponse.json(
      { message: "Folder created successfully", folder: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating folder:", error);
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

    const userFolders = await db
      .select()
      .from(folders)
      .where(eq(folders.userId, userId));
    console.log("folders", folders);

    return NextResponse.json({ userFolders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
