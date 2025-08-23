import type { TurmasRepository, UpdateTurmaInput } from '../../repositories/turmas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class UpdateTurmaUseCase {
  constructor(private turmasRepo: TurmasRepository) {}

  async execute(id: string, data: UpdateTurmaInput) {
    const found = await this.turmasRepo.findById(id);
    if (!found) throw new AppError('Turma não encontrada', 404);

    const payload: UpdateTurmaInput = {};
    if (data.nome !== undefined) payload.nome = data.nome;
    if (data.capacidade !== undefined) payload.capacidade = data.capacidade;

    const turma = await this.turmasRepo.update(id, payload);
    return { turma };
  }
}
