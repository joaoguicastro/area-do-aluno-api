import type { ExerciciosRepository, CreateEntregaInput } from '../../repositories/exercicios-repository.js';
import type { MatriculasRepository } from '../../repositories/matriculas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class SubmitEntregaUseCase {
  constructor(private repo: ExerciciosRepository, private matriculasRepo: MatriculasRepository) {}

  async execute(exercicioId: string, alunoId: string, input: CreateEntregaInput) {
    const ex = await this.repo.findById(exercicioId);
    if (!ex) throw new AppError('Exercício não encontrado', 404);
    if (!ex.publicado) throw new AppError('Exercício ainda não publicado', 409);

    const active = await this.matriculasRepo.findActiveByAlunoAndCurso(alunoId, ex.cursoId);
    if (!active) throw new AppError('Aluno não possui matrícula ATIVA neste curso', 403);

    const prev = await this.repo.findEntregaByExercicioAndAluno(exercicioId, alunoId);
    if (prev) {
      const updated = await this.repo.updateEntrega(prev.id, {
        texto: input.texto ?? null,
        arquivoUrl: input.arquivoUrl ?? null,
      });
      return { entrega: updated, updated: true };
    }

    const created = await this.repo.createEntrega(exercicioId, alunoId, {
      texto: input.texto ?? null,
      arquivoUrl: input.arquivoUrl ?? null,
    });
    return { entrega: created, updated: false };
  }
}
