-- CreateTable
CREATE TABLE "public"."ConfiguracaoSystema" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "diasAtrasoBloqueio" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracaoSystema_pkey" PRIMARY KEY ("id")
);
