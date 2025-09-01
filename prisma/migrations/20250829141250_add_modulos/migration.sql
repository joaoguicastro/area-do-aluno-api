-- AlterTable
ALTER TABLE "public"."VideoAula" ADD COLUMN     "moduloId" TEXT;

-- CreateTable
CREATE TABLE "public"."Modulo" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Modulo" ADD CONSTRAINT "Modulo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoAula" ADD CONSTRAINT "VideoAula_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "public"."Modulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
