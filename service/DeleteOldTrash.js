import { db } from "@/db";
import { folders, files, trashedItems } from "@/db/schema";
import { lt, inArray } from "drizzle-orm";
import { subDays } from "date-fns";
async function getAllChildrenIds(parentIds) {
  if (!parentIds || parentIds.length === 0) {
    return { folderIds: [], fileIds: [] };
  }

  // Get subfolders
  let childFolders = [];
  if (parentIds.length > 0) {
    childFolders = await db
      .select({ id: folders.id })
      .from(folders)
      .where(inArray(folders.parentId, parentIds));
  }

  const folderIds = childFolders.map(f => f.id);

  // Get files directly inside these parents
  let childFiles = [];
  if (parentIds.length > 0) {
    childFiles = await db
      .select({ id: files.id })
      .from(files)
      .where(inArray(files.folderId, parentIds));
  }

  const fileIds = childFiles.map(f => f.id);

  // Recursion for deeper folders
  if (folderIds.length > 0) {
    const deeper = await getAllChildrenIds(folderIds);
    return {
      folderIds: [...folderIds, ...deeper.folderIds],
      fileIds: [...fileIds, ...deeper.fileIds],
    };
  }

  return { folderIds, fileIds };
}


async function deleteOldTrash() {
  try {
    const cutoffDate = subDays(new Date(), 20);

    // Find trashed items older than cutoff
    const rowsToDelete = await db
      .select()
      .from(trashedItems)
      .where(lt(trashedItems.createdAt, cutoffDate));

    if (rowsToDelete.length === 0) {
      return { message: "No rows to delete." };
    }

    let idsToDeleteFromTrash = [];
    let allFolderIds = [];
    let allFileIds = [];

    for (const row of rowsToDelete) {
      if (row.type === "folder") {
        // Get all subfolders and files for this folder
        const { folderIds, fileIds } = await getAllChildrenIds([row.originalFileId]);
        allFolderIds.push(...folderIds);
        allFileIds.push(...fileIds);
      }
      idsToDeleteFromTrash.push(row.id);
    }

    // Remove duplicates
    allFolderIds = [...new Set(allFolderIds)];
    allFileIds = [...new Set(allFileIds)];
    idsToDeleteFromTrash = [...new Set(idsToDeleteFromTrash)];

    // Delete files first, then folders (to avoid foreign key issues)
    if (allFileIds.length > 0) {
      await db.delete(files).where(inArray(files.id, allFileIds));
    }
    if (allFolderIds.length > 0) {
      await db.delete(folders).where(inArray(folders.id, allFolderIds));
    }

    // Finally delete from trashedItems
    await db
      .delete(trashedItems)
      .where(inArray(trashedItems.id, idsToDeleteFromTrash));

    return {
      message: `${allFileIds.length} files, ${allFolderIds.length} folders, and ${idsToDeleteFromTrash.length} trashed items deleted successfully.`,
    };
  } catch (error) {
    throw new Error(error.message || "Delete failed");
  }
}

export default deleteOldTrash;
