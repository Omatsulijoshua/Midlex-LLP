CREATE TABLE IF NOT EXISTS "Property" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "location" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "offerTypes" TEXT[] NOT NULL DEFAULT ARRAY['SALE']::TEXT[],
  "bedrooms" INTEGER NOT NULL DEFAULT 0,
  "bathrooms" INTEGER NOT NULL DEFAULT 0,
  "sizeSqm" DOUBLE PRECISION,
  "images" TEXT[] NOT NULL,
  "features" TEXT[] NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Property_slug_key" ON "Property"("slug");
