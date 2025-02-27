-- CreateTable
CREATE TABLE "StrengthWorkout" (
    "id" SERIAL NOT NULL,
    "exercise" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrengthWorkout_pkey" PRIMARY KEY ("id")
);
