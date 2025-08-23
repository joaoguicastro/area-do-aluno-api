-- CreateTable
CREATE TABLE "public"."Turma" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "nome" TEXT,
    "capacidade" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TurmaHorario" (
    "id" TEXT NOT NULL,
    "turmaId" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "inicio" TEXT NOT NULL,
    "fim" TEXT NOT NULL,

    CONSTRAINT "TurmaHorario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Turma_cursoId_idx" ON "public"."Turma"("cursoId");

-- CreateIndex
CREATE INDEX "TurmaHorario_turmaId_idx" ON "public"."TurmaHorario"("turmaId");

-- AddForeignKey
ALTER TABLE "public"."Turma" ADD CONSTRAINT "Turma_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TurmaHorario" ADD CONSTRAINT "TurmaHorario_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
