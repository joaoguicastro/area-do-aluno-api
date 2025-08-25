-- CreateTable
CREATE TABLE "public"."AlunoAcesso" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "alunoId" TEXT NOT NULL,

    CONSTRAINT "AlunoAcesso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlunoAcesso_email_key" ON "public"."AlunoAcesso"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AlunoAcesso_alunoId_key" ON "public"."AlunoAcesso"("alunoId");

-- AddForeignKey
ALTER TABLE "public"."AlunoAcesso" ADD CONSTRAINT "AlunoAcesso_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
