import type { ExerciciosRepository } from '../../repositories/exercicios-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class PublishExercicioUseCase {
  constructor(private repo: ExerciciosRepository) {}

  async execute(id: string, publicado: boolean) {
    const found = await this.repo.findById(id);
    if (!found) throw new AppError('Exercício não encontrado', 404);
    const updated = await this.repo.setPublicado(id, publicado);
    return { exercicio: updated };
  }
}
