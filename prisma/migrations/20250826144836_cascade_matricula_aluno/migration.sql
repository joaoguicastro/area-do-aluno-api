-- DropForeignKey
ALTER TABLE "public"."Matricula" DROP CONSTRAINT "Matricula_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Matricula" DROP CONSTRAINT "Matricula_turmaId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Matricula" ADD CONSTRAINT "Matricula_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Curso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Matricula" ADD CONSTRAINT "Matricula_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "public"."Turma"("id") ON DELETE CASCADE ON UPDATE CASCADE;
