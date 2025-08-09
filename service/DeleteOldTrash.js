import { db } from "@/db";
import { trashedItems } from "@/db/schema";
import { lt } from "drizzle-orm";
import { addMinutes, subHours, subMinutes } from "date-fns"; // 330 min = 5.5 hours

async function deleteOldTrash() {
  const cutoffDate = subMinutes(new Date(), 2);

  console.log("Cutoff Date (local):", cutoffDate);
  console.log("Cutoff Date (ISO):", cutoffDate.toISOString());

  // Step 1: See which rows match before delete
  const rowsToDelete = await db
    .select()
    .from(trashedItems)
    .where(lt(trashedItems.createdAt, cutoffDate));

  console.log("Rows that match:", rowsToDelete);

  // Step 2: If matches found, delete
  if (rowsToDelete.length > 0) {
    await db.delete(trashedItems).where(lt(trashedItems.createdAt, cutoffDate));
    console.log("Deleted rows:", rowsToDelete.length);
  } else {
    console.log("No rows matched the condition.");
  }
}

export default deleteOldTrash;
