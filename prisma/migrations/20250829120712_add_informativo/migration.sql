-- CreateTable
CREATE TABLE "public"."Informativo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "cursoId" TEXT,
    "turmaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Informativo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Informativo_cursoId_idx" ON "public"."Informativo"("cursoId");

-- CreateIndex
CREATE INDEX "Informativo_turmaId_idx" ON "public"."Informativo"("turmaId");

-- CreateIndex
CREATE INDEX "Informativo_createdAt_idx" ON "public"."Informativo"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Informativo" ADD CONSTRAINT "Informativo_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Informativo" ADD CONSTRAINT "Informativo_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
