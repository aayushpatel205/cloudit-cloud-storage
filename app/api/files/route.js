import { handleUpload } from "@/service/ImageUpload";
import { db } from "@/db/index";
import { NextResponse } from "next/server";
import { files, starredFiles } from "@/db/schema";
import { eq, and, isNull, isNotNull } from "drizzle-orm";

export async function POST(req) {
  const formData = await req.formData();
  const selectedFile = formData.get("selectedFile"); // key as appended from frontend FormData
  const fileName = formData.get("fileName");
  const fileTag = formData.get("fileTag");
  const userId = formData.get("userId");
  const folderIdRaw = formData.get("folderId");
  const folderId = !folderIdRaw || folderIdRaw === "null" ? null : folderIdRaw;

  try {
    const url = await handleUpload(selectedFile, fileName, fileTag);
    const result = await db
      .insert(files)
      .values({
        name: fileName,
        type: selectedFile.type,
        size: selectedFile.size,
        url: url,
        thumbnailUrl: null,
        userId: userId,
        folderId: folderId,
      })
      .returning(); // 🔥 returns inserted row(s)

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
        isStarred: isNotNull(starredFiles.id), // boolean indicating starred status
      })
      .from(files)
      .leftJoin(
        starredFiles,
        and(
          eq(files.id, starredFiles.originalFileId),
          eq(starredFiles.userId, userId) // make sure the join is per-user
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
