import { db } from "@/db/index";
import { NextResponse } from "next/server";
import { folders, trashedItems, files } from "@/db/schema"; // assuming your folders schema is here
import { eq, and, isNull, inArray } from "drizzle-orm";

export async function POST(req) {
  const { userId, fileIds, folderIds } = await req.json();
  try {
    if (
      (!fileIds || fileIds.length === 0) &&
      (!folderIds || folderIds.length === 0)
    ) {
      return NextResponse.json(
        { error: "At least one fileId or folderId is required" },
        { status: 400 }
      );
    }

    // Permanently delete files
    if (fileIds && fileIds.length > 0) {
      await db.delete(files).where(inArray(files.id, fileIds));
    }

    // Permanently delete folders
    if (folderIds && folderIds.length > 0) {
      await db.delete(folders).where(inArray(folders.id, folderIds));
    }

    return NextResponse.json({ message: "Permanent deletion successful" });
  } catch (error) {
    console.error("Recursive deletion failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
