import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { folders } from "./schema.js";
dotenv.config();

if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
export const db = drizzle({ client: sql });

export const createFolder = async (name, userId, parentId) => {
  try {
    const result = await db
      .insert(folders)
      .values({
        name,
        userId,
        parentId: parentId || null
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

