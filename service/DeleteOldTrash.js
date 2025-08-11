import { db } from "@/db";
import { trashedItems } from "@/db/schema";
import { lt } from "drizzle-orm";
import { addMinutes, subHours, subMinutes } from "date-fns";

async function deleteOldTrash() {
  const cutoffDate = subHours(new Date(), 2);

  const rowsToDelete = await db
    .select()
    .from(trashedItems)
    .where(lt(trashedItems.createdAt, cutoffDate));

  if (rowsToDelete.length > 0) {
    await db.delete(trashedItems).where(lt(trashedItems.createdAt, cutoffDate));
    return { message: `${rowsToDelete.length} rows deleted successfully.` };
  } else {
    return { message: "No rows to delete." };
  }
}

export default deleteOldTrash;
