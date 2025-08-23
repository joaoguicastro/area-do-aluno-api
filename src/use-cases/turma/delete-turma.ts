import type { TurmasRepository } from '../../repositories/turmas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class DeleteTurmaUseCase {
  constructor(private turmasRepo: TurmasRepository) {}

  async execute(id: string) {
    const found = await this.turmasRepo.findById(id);
    if (!found) throw new AppError('Turma não encontrada', 404);

    await this.turmasRepo.delete(id);
    return { ok: true };
  }
}
