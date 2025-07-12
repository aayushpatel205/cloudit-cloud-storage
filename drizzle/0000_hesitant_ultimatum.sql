CREATE TABLE "files" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"type" varchar(100),
	"url" text,
	"thumbnail_url" text,
	"user_id" uuid,
	"folder_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"user_id" uuid,
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now()
);
