import type { CursosRepository } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class ListVideoAulasLiberadasUseCase {
  constructor(private repo: CursosRepository) {}
  async execute(cursoId: string, now: Date = new Date()) {
    const curso = await this.repo.findById(cursoId);
    if (!curso) throw new AppError('Curso não encontrado', 404);
    const data = await this.repo.listVideoAulasLiberadas(cursoId, now);
    return { data };
  }
}
