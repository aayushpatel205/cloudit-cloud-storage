import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  bigint
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

export const starredFiles = pgTable("starred_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalFileId: uuid("original_file_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),

  name: varchar("name", { length: 255 }),
  type: varchar("type", { length: 100 }),
  size: bigint("size", { mode: "number" }),
  url: text("url"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trashedItems = pgTable("trashed_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalFileId: uuid("original_item_id").notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),

  name: varchar("name", { length: 255 }),
  type: varchar("type", { length: 100 }),
  size: bigint("size", { mode: "number" }),
  url: text("url"), 
  thumbnailUrl: text("thumbnail_url"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

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

export const trashedItemRelations = relations(trashedItems, ({ one }) => ({
  originalFile: one(files, {
    fields: [trashedItems.originalItemId],
    references: [files.id],
    relationName: "trashedFile",
  }),
  originalFolder: one(folders, {
    fields: [trashedItems.originalItemId],
    references: [folders.id],
    relationName: "trashedFolder",
  }),
}));
