import type { CursosRepository } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class GetCursoUseCase {
  constructor(private repo: CursosRepository) {}

  async execute(id: string) {
    const curso = await this.repo.findById(id);
    if (!curso) throw new AppError('Curso não encontrado', 404);
    return { curso };
  }
}
