-- CreateTable
CREATE TABLE "JourneyLocation" (
    "id" SERIAL NOT NULL,
    "journeyId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JourneyLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JourneyLocation_journeyId_idx" ON "JourneyLocation"("journeyId");

-- CreateIndex
CREATE INDEX "JourneyLocation_recordedAt_idx" ON "JourneyLocation"("recordedAt");

-- AddForeignKey
ALTER TABLE "JourneyLocation" ADD CONSTRAINT "JourneyLocation_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
