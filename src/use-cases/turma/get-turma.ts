import type { TurmasRepository } from '../../repositories/turmas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class GetTurmaUseCase {
  constructor(private turmasRepo: TurmasRepository) {}

  async execute(id: string) {
    const turma = await this.turmasRepo.findById(id);
    if (!turma) throw new AppError('Turma não encontrada', 404);
    return { turma };
  }
}
