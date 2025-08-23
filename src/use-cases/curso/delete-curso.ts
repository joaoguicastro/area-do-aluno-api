import type { CursosRepository } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class DeleteCursoUseCase {
  constructor(private repo: CursosRepository) {}

  async execute(id: string) {
    const found = await this.repo.findById(id);
    if (!found) throw new AppError('Curso não encontrado', 404);

    await this.repo.delete(id);
    return { ok: true };
  }
}
