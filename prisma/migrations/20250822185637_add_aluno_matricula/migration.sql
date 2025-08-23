-- CreateEnum
CREATE TYPE "public"."MatriculaStatus" AS ENUM ('ATIVA', 'TRANCADA', 'CANCELADA', 'CONCLUIDA');

-- CreateTable
CREATE TABLE "public"."Aluno" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpfAluno" TEXT NOT NULL,
    "dataNascimentoAluno" TIMESTAMP(3) NOT NULL,
    "nomeResponsavel" TEXT NOT NULL,
    "cpfResponsavel" TEXT NOT NULL,
    "dataNascimentoResponsavel" TIMESTAMP(3) NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "fotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Matricula" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "turmaId" TEXT,
    "status" "public"."MatriculaStatus" NOT NULL DEFAULT 'ATIVA',
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_cpfAluno_key" ON "public"."Aluno"("cpfAluno");

-- CreateIndex
CREATE INDEX "Matricula_alunoId_idx" ON "public"."Matricula"("alunoId");

-- CreateIndex
CREATE INDEX "Matricula_cursoId_idx" ON "public"."Matricula"("cursoId");

-- CreateIndex
CREATE INDEX "Matricula_turmaId_idx" ON "public"."Matricula"("turmaId");

-- AddForeignKey
ALTER TABLE "public"."Matricula" ADD CONSTRAINT "Matricula_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matricula" ADD CONSTRAINT "Matricula_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matricula" ADD CONSTRAINT "Matricula_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE SET NULL ON UPDATE CASCADE;
