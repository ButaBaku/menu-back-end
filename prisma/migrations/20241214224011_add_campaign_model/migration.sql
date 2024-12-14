-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "titleEN" TEXT NOT NULL,
    "titleAZ" TEXT NOT NULL,
    "textEN" TEXT,
    "textAZ" TEXT,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);
