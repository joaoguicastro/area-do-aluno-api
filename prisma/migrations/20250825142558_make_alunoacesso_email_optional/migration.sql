/*
  Warnings:

  - You are about to drop the column `email` on the `AlunoAcesso` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."AlunoAcesso_email_key";

-- AlterTable
ALTER TABLE "public"."AlunoAcesso" DROP COLUMN "email";
