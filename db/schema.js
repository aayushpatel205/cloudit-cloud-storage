import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  bigint,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// folders table
export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// files table
export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  type: varchar("type", { length: 100 }),
  size: bigint("size", { mode: "number" }),
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  userId: varchar("user_id", { length: 255 }),
  folderId: uuid("folder_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// starred_files table (with file snapshot)
export const starredFiles = pgTable(
  "starred_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    originalFileId: uuid("original_file_id").notNull(), // links back to original file
    userId: varchar("user_id", { length: 255 }).notNull(), // who starred it

    // Snapshot of file metadata
    name: varchar("name", { length: 255 }),
    type: varchar("type", { length: 100 }),
    size: bigint("size", { mode: "number" }),
    url: text("url"),
    thumbnailUrl: text("thumbnail_url"),
    createdAt: timestamp("created_at").defaultNow(),
  }
);

// Relations
export const folderRelations = relations(folders, ({ many }) => ({
  files: many(files),
}));

export const fileRelations = relations(files, ({ one, many }) => ({
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
  starredEntries: many(starredFiles),
}));

export const starredFileRelations = relations(starredFiles, ({ one }) => ({
  originalFile: one(files, {
    fields: [starredFiles.originalFileId],
    references: [files.id],
  }),
}));
