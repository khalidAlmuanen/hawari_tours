-- Drop the entire blogs table to start fresh
DROP TABLE IF EXISTS "public"."blogs" CASCADE;

-- Drop old enum if exists
DROP TYPE IF EXISTS "BlogCategory" CASCADE;
