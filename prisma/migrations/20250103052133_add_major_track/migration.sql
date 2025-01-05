-- CreateEnum
CREATE TYPE "MajorTrackType" AS ENUM ('SINGLE', 'DOUBLE', 'MINOR', 'INTEGRATED');

-- CreateTable
CREATE TABLE "UserMajorTrack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedTrack" "MajorTrackType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMajorTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMajorTrack_userId_key" ON "UserMajorTrack"("userId");

-- AddForeignKey
ALTER TABLE "UserMajorTrack" ADD CONSTRAINT "UserMajorTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
