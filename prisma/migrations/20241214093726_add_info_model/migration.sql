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

INSERT INTO "Info" ("id", "logo", "titleEN", "titleAZ", "phoneNumbers", "addressEN", "addressAZ", "instagram", "facebook", "whatsapp") VALUES (1, 'http://164.92.190.92/info/logo.jpg', 'Buta Baku', 'Buta Baku', ARRAY['503020203', '553020203', '773020203'], 'Rüstəm Rüstəmov 2524, Baku, Azerbaijan', 'Rüstəm Rüstəmov 2524, Bakı, Azərbaycan', 'https://www.instagram.com/butabaku_restaurant/', NULL, 'https://api.whatsapp.com/message/6OMO3MJC4FHQD1');