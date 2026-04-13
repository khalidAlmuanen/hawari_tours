-- Drop dependent objects first
DROP TABLE IF EXISTS "public"."comments" CASCADE;
DROP TABLE IF EXISTS "public"."blogs" CASCADE;

-- Drop old enum
DROP TYPE IF EXISTS "BlogCategory" CASCADE;

-- Create new enum with correct values
CREATE TYPE "BlogCategory" AS ENUM ('CULTURE', 'NATURE', 'TRAVEL', 'STORIES');

-- Recreate blogs table
CREATE TABLE "public"."blogs" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL,
    "excerptAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" "BlogCategory" NOT NULL,
    "tags" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT,
    "authorName" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- Create unique index on slug
CREATE UNIQUE INDEX "blogs_slug_key" ON "public"."blogs"("slug");

-- Create other indexes
CREATE INDEX "blogs_category_idx" ON "public"."blogs"("category");
CREATE INDEX "blogs_published_idx" ON "public"."blogs"("published");
CREATE INDEX "blogs_featured_idx" ON "public"."blogs"("featured");
CREATE INDEX "blogs_slug_idx" ON "public"."blogs"("slug");

-- Recreate comments table
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blogId" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- Create indexes for comments
CREATE INDEX "comments_blogId_idx" ON "public"."comments"("blogId");
CREATE INDEX "comments_approved_idx" ON "public"."comments"("approved");

-- Add foreign key
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
