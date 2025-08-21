-- CreateEnum
CREATE TYPE "public"."Modality" AS ENUM ('ONLINE', 'PRESENCIAL');

-- CreateTable
CREATE TABLE "public"."Curso" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "modality" "public"."Modality" NOT NULL,
    "duracaoHoras" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VideoAula" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "urlVideo" TEXT NOT NULL,
    "ordem" INTEGER,
    "duracaoMin" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoAula_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."VideoAula" ADD CONSTRAINT "VideoAula_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
