-- CreateTable
CREATE TABLE "Info" (
    "id" SERIAL NOT NULL,
    "logo" TEXT NOT NULL,
    "titleEN" TEXT NOT NULL,
    "titleAZ" TEXT NOT NULL,
    "phoneNumbers" TEXT[],
    "addressEN" TEXT NOT NULL,
    "addressAZ" TEXT NOT NULL,
    "instagram" TEXT,
    "facebook" TEXT,
    "whatsapp" TEXT,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);
