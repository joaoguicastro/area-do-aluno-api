import type { CursosRepository } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class ListVideoAulasUseCase {
  constructor(private repo: CursosRepository) {}

  async execute(cursoId: string) {
    const curso = await this.repo.findById(cursoId);
    if (!curso) throw new AppError('Curso não encontrado', 404);

    const videos = await this.repo.listVideoAulas(cursoId);
    return { videos };
  }
}
