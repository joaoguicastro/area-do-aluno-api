import type { TurmasRepository } from '../../repositories/turmas-repository.js';

export class RemoveHorarioUseCase {
  constructor(private turmasRepo: TurmasRepository) {}

  async execute(horarioId: string) {
    await this.turmasRepo.removeHorario(horarioId);
    return { ok: true };
  }
}
