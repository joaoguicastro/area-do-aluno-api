-- CreateEnum
CREATE TYPE "public"."StatusParcela" AS ENUM ('ABERTA', 'PAGA', 'ESTORNADA');

-- CreateEnum
CREATE TYPE "public"."FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'BOLETO');

-- AlterTable
ALTER TABLE "public"."Matricula" ADD COLUMN     "financeiroId" TEXT;

-- CreateTable
CREATE TABLE "public"."Financeiro" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "numeroParcelas" INTEGER NOT NULL,
    "diaVencimento" INTEGER,
    "jurosAoMes" DECIMAL(5,2),
    "multaPercent" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Parcela" (
    "id" TEXT NOT NULL,
    "matriculaId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "status" "public"."StatusParcela" NOT NULL DEFAULT 'ABERTA',
    "formaPagamento" "public"."FormaPagamento",
    "pagoEm" TIMESTAMP(3),
    "valorPago" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parcela_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Financeiro_cursoId_key" ON "public"."Financeiro"("cursoId");

-- CreateIndex
CREATE INDEX "Parcela_vencimento_idx" ON "public"."Parcela"("vencimento");

-- CreateIndex
CREATE UNIQUE INDEX "Parcela_matriculaId_numero_key" ON "public"."Parcela"("matriculaId", "numero");

-- AddForeignKey
ALTER TABLE "public"."Matricula" ADD CONSTRAINT "Matricula_financeiroId_fkey" FOREIGN KEY ("financeiroId") REFERENCES "public"."Financeiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Financeiro" ADD CONSTRAINT "Financeiro_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parcela" ADD CONSTRAINT "Parcela_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "public"."Matricula"("id") ON DELETE CASCADE ON UPDATE CASCADE;
