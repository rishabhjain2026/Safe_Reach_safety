-- CreateTable
CREATE TABLE "SafetyEvent" (
    "id" SERIAL NOT NULL,
    "journeyId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SafetyEvent_journeyId_idx" ON "SafetyEvent"("journeyId");

-- CreateIndex
CREATE INDEX "SafetyEvent_type_idx" ON "SafetyEvent"("type");

-- AddForeignKey
ALTER TABLE "SafetyEvent" ADD CONSTRAINT "SafetyEvent_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
