import type { TurmasRepository } from '../../repositories/turmas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class GetTurmaCursoUseCase {
  constructor(private turmasRepo: TurmasRepository) {}

  async execute(cursoId: string) {
    const turma = await this.turmasRepo.findByIdCurso(cursoId);
    if (!turma) throw new AppError('Turma não encontrada', 404);
    return { turma };
  }
}