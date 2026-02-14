-- CreateEnum
CREATE TYPE "DestinationCategory" AS ENUM ('NATURE', 'HERITAGE', 'BEACH', 'MOUNTAIN', 'ARCHAEOLOGICAL', 'WILDLIFE', 'CULTURAL', 'URBAN', 'ADVENTURE');

-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "bestTimeToVisit" TEXT,
ADD COLUMN     "category" "DestinationCategory" NOT NULL DEFAULT 'NATURE',
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "unesco" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "destinations_category_idx" ON "destinations"("category");

-- CreateIndex
CREATE INDEX "destinations_featured_idx" ON "destinations"("featured");
