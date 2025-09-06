-- CreateTable
CREATE TABLE "public"."Apostila" (
    "id" TEXT NOT NULL,
    "cursoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "urlPdf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apostila_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Apostila_cursoId_idx" ON "public"."Apostila"("cursoId");

-- AddForeignKey
ALTER TABLE "public"."Apostila" ADD CONSTRAINT "Apostila_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
