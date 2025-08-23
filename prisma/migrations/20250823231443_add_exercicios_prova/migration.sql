-- CreateEnum
CREATE TYPE "public"."QuestaoTipo" AS ENUM ('MULTIPLA_ESCOLHA', 'DISSERTATIVA');

-- CreateEnum
CREATE TYPE "public"."ProvaStatusSubmissao" AS ENUM ('EM_ANDAMENTO', 'ENVIADA', 'CORRIGIDA');

-- CreateTable
CREATE TABLE "public"."Exercicio" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataEntrega" TIMESTAMP(3),
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EntregaExercicio" (
    "id" TEXT NOT NULL,
    "exercicioId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "texto" TEXT,
    "arquivoUrl" TEXT,
    "enviadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nota" DOUBLE PRECISION,

    CONSTRAINT "EntregaExercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prova" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "inicioEm" TIMESTAMP(3),
    "fimEm" TIMESTAMP(3),
    "duracaoMin" INTEGER,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prova_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProvaQuestao" (
    "id" TEXT NOT NULL,
    "provaId" TEXT NOT NULL,
    "ordem" INTEGER,
    "tipo" "public"."QuestaoTipo" NOT NULL,
    "enunciado" TEXT NOT NULL,
    "valor" DOUBLE PRECISION,

    CONSTRAINT "ProvaQuestao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProvaQuestaoOpcao" (
    "id" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER,

    CONSTRAINT "ProvaQuestaoOpcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProvaSubmissao" (
    "id" TEXT NOT NULL,
    "provaId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "iniciadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadoEm" TIMESTAMP(3),
    "notaTotal" DOUBLE PRECISION,
    "status" "public"."ProvaStatusSubmissao" NOT NULL DEFAULT 'EM_ANDAMENTO',

    CONSTRAINT "ProvaSubmissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProvaResposta" (
    "id" TEXT NOT NULL,
    "submissaoId" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "opcaoId" TEXT,
    "respostaTxt" TEXT,
    "correta" BOOLEAN,
    "nota" DOUBLE PRECISION,

    CONSTRAINT "ProvaResposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exercicio_cursoId_idx" ON "public"."Exercicio"("cursoId");

-- CreateIndex
CREATE INDEX "EntregaExercicio_alunoId_idx" ON "public"."EntregaExercicio"("alunoId");

-- CreateIndex
CREATE UNIQUE INDEX "EntregaExercicio_exercicioId_alunoId_key" ON "public"."EntregaExercicio"("exercicioId", "alunoId");

-- CreateIndex
CREATE INDEX "Prova_cursoId_idx" ON "public"."Prova"("cursoId");

-- CreateIndex
CREATE INDEX "ProvaQuestao_provaId_idx" ON "public"."ProvaQuestao"("provaId");

-- CreateIndex
CREATE INDEX "ProvaQuestaoOpcao_questaoId_idx" ON "public"."ProvaQuestaoOpcao"("questaoId");

-- CreateIndex
CREATE INDEX "ProvaSubmissao_alunoId_idx" ON "public"."ProvaSubmissao"("alunoId");

-- CreateIndex
CREATE UNIQUE INDEX "ProvaSubmissao_provaId_alunoId_key" ON "public"."ProvaSubmissao"("provaId", "alunoId");

-- CreateIndex
CREATE INDEX "ProvaResposta_questaoId_idx" ON "public"."ProvaResposta"("questaoId");

-- CreateIndex
CREATE INDEX "ProvaResposta_opcaoId_idx" ON "public"."ProvaResposta"("opcaoId");

-- CreateIndex
CREATE UNIQUE INDEX "ProvaResposta_submissaoId_questaoId_key" ON "public"."ProvaResposta"("submissaoId", "questaoId");

-- AddForeignKey
ALTER TABLE "public"."Exercicio" ADD CONSTRAINT "Exercicio_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntregaExercicio" ADD CONSTRAINT "EntregaExercicio_exercicioId_fkey" FOREIGN KEY ("exercicioId") REFERENCES "public"."Exercicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EntregaExercicio" ADD CONSTRAINT "EntregaExercicio_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prova" ADD CONSTRAINT "Prova_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProvaQuestao" ADD CONSTRAINT "ProvaQuestao_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "public"."Prova"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProvaQuestaoOpcao" ADD CONSTRAINT "ProvaQuestaoOpcao_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "public"."ProvaQuestao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProvaSubmissao" ADD CONSTRAINT "ProvaSubmissao_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "public"."Prova"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProvaSubmissao" ADD CONSTRAINT "ProvaSubmissao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProvaResposta" ADD CONSTRAINT "ProvaResposta_submissaoId_fkey" FOREIGN KEY ("submissaoId") REFERENCES "public"."ProvaSubmissao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProvaResposta" ADD CONSTRAINT "ProvaResposta_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "public"."ProvaQuestao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProvaResposta" ADD CONSTRAINT "ProvaResposta_opcaoId_fkey" FOREIGN KEY ("opcaoId") REFERENCES "public"."ProvaQuestaoOpcao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
