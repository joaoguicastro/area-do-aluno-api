import type { TurmasRepository } from '../../repositories/turmas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class ListHorariosUseCase {
  constructor(private turmasRepo: TurmasRepository) {}

  async execute(turmaId: string) {
    const turma = await this.turmasRepo.findById(turmaId);
    if (!turma) throw new AppError('Turma não encontrada', 404);

    const horarios = await this.turmasRepo.listHorarios(turmaId);
    return { horarios };
  }
}
