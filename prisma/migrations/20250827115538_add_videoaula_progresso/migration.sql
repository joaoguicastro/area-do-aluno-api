-- CreateTable
CREATE TABLE "public"."VideoAulaProgresso" (
    "id" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "videoAulaId" TEXT NOT NULL,
    "positionSec" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoAulaProgresso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoAulaProgresso_alunoId_cursoId_idx" ON "public"."VideoAulaProgresso"("alunoId", "cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoAulaProgresso_alunoId_videoAulaId_key" ON "public"."VideoAulaProgresso"("alunoId", "videoAulaId");

-- AddForeignKey
ALTER TABLE "public"."VideoAulaProgresso" ADD CONSTRAINT "VideoAulaProgresso_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "public"."Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoAulaProgresso" ADD CONSTRAINT "VideoAulaProgresso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VideoAulaProgresso" ADD CONSTRAINT "VideoAulaProgresso_videoAulaId_fkey" FOREIGN KEY ("videoAulaId") REFERENCES "public"."VideoAula"("id") ON DELETE CASCADE ON UPDATE CASCADE;
