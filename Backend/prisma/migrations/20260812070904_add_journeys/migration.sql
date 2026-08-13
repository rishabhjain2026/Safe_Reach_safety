-- CreateEnum
CREATE TYPE "JourneyStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'MISSED');

-- CreateTable
CREATE TABLE "Journey" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "originId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,
    "plannedDeparture" TIMESTAMP(3) NOT NULL,
    "expectedDuration" INTEGER NOT NULL,
    "expectedArrival" TIMESTAMP(3),
    "actualDeparture" TIMESTAMP(3),
    "actualArrival" TIMESTAMP(3),
    "status" "JourneyStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Journey_userId_idx" ON "Journey"("userId");

-- CreateIndex
CREATE INDEX "Journey_originId_idx" ON "Journey"("originId");

-- CreateIndex
CREATE INDEX "Journey_destinationId_idx" ON "Journey"("destinationId");

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey" ADD CONSTRAINT "Journey_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
