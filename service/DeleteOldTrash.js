import { db } from "@/db";
import { trashedItems } from "@/db/schema";
import { lt } from "drizzle-orm";
import { addMinutes, subHours, subMinutes } from "date-fns"; 

async function deleteOldTrash() {
  const cutoffDate = subHours(new Date(), 2);

  console.log("Cutoff Date (local):", cutoffDate);
  console.log("Cutoff Date (ISO):", cutoffDate.toISOString());

  const rowsToDelete = await db
    .select()
    .from(trashedItems)
    .where(lt(trashedItems.createdAt, cutoffDate));

  console.log("Rows that match:", rowsToDelete);

  if (rowsToDelete.length > 0) {
    await db.delete(trashedItems).where(lt(trashedItems.createdAt, cutoffDate));
    console.log("Deleted rows:", rowsToDelete.length);
  } else {
    console.log("No rows matched the condition.");
  }
}

export default deleteOldTrash;
