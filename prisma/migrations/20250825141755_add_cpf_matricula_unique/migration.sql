/*
  Warnings:

  - A unique constraint covering the columns `[matricula]` on the table `Aluno` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matricula` to the `Aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Aluno" ADD COLUMN     "matricula" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_matricula_key" ON "public"."Aluno"("matricula");

-- CreateIndex
CREATE INDEX "AlunoAcesso_alunoId_idx" ON "public"."AlunoAcesso"("alunoId");
