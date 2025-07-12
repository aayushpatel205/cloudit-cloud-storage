import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  userId: varchar("user_id", { length: 255 }), // <-- changed
  parentId: uuid("parent_id"), // if using UUID for nesting, else varchar too
  createdAt: timestamp("created_at").defaultNow(),
});

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  type: varchar("type", { length: 100 }),
  size: bigint("size", { mode: "number" }), // ✅ fixed here
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  userId: varchar("user_id", { length: 255 }), // Clerk-managed
  folderId: uuid("folder_id"), // nullable for files in root
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Relations (Drizzle side, not SQL foreign keys)
export const folderRelations = relations(folders, ({ many }) => ({
  files: many(files), // one-to-many: folder → files
}));

export const fileRelations = relations(files, ({ one }) => ({
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
}));
