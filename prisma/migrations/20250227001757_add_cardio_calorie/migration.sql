-- CreateTable
CREATE TABLE "CardioSession" (
    "id" SERIAL NOT NULL,
    "activity" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardioSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalorieEntry" (
    "id" SERIAL NOT NULL,
    "meal" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalorieEntry_pkey" PRIMARY KEY ("id")
);
