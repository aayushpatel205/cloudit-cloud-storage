import { handleUpload } from "@/service/ImageUpload";
import { db } from "@/db/index";
import { NextResponse } from "next/server";
import { files, starredFiles, trashedItems } from "@/db/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";

export async function POST(req) {
  const formData = await req.formData();
  const selectedFile = formData.get("selectedFile");
  const newFileRaw = formData.get("newFileRaw");
  const fileName = formData.get("fileName");
  const fileTag = formData.get("fileTag");
  const userId = formData.get("userId");
  const folderIdRaw = formData.get("folderId");
  const newUrl = formData.get("newUrl");
  const folderId = !folderIdRaw || folderIdRaw === "null" ? null : folderIdRaw;

  const newFile = JSON.parse(newFileRaw);
  try {
    let url = "";
    if (selectedFile) {
      url = await handleUpload(selectedFile, fileName, fileTag);
    }
    const result = await db
      .insert(files)
      .values({
        name: fileName,
        type: selectedFile ? selectedFile.type : newFile.type,
        size: selectedFile ? selectedFile.size : newFile.size,
        url: selectedFile ? url : newUrl,
        thumbnailUrl: null,
        userId: userId,
        folderId: folderId,
      })
      .returning();

    return NextResponse.json(
      { message: "File uploaded successfully", file: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
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
    const parentId = searchParams.get("parentId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const userFiles = await db
      .select({
        id: files.id,
        name: files.name,
        type: files.type,
        size: files.size,
        url: files.url,
        thumbnailUrl: files.thumbnailUrl,
        folderId: files.folderId,
        createdAt: files.createdAt,
        isStarred: isNotNull(starredFiles.id),
      })
      .from(files)
      .leftJoin(
        starredFiles,
        and(
          eq(files.id, starredFiles.originalFileId),
          eq(starredFiles.userId, userId)
        )
      )
      .where(
        and(
          eq(files.userId, userId),
          parentId ? eq(files.folderId, parentId) : isNull(files.folderId)
        )
      );

    return NextResponse.json({ userFiles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching files:", error);
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
      console.warn("Missing userId or fileId");
      return NextResponse.json(
        { error: "userId and fileId are required" },
        { status: 400 }
      );
    }

    const result = await db
      .delete(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    return NextResponse.json(
      { message: "File deleted successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error); // <-- Important line
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
