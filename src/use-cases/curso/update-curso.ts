import type { CursosRepository, UpdateCursoInput } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class UpdateCursoUseCase {
  constructor(private repo: CursosRepository) {}

  async execute(id: string, data: UpdateCursoInput) {
    const found = await this.repo.findById(id);
    if (!found) throw new AppError('Curso não encontrado', 404);

    if (data.modality === 'PRESENCIAL' && found.modality === 'ONLINE') {
      const videos = await this.repo.listVideoAulas(id);
      if (videos.length > 0) {
        throw new AppError('Não é possível mudar para PRESENCIAL com vídeo-aulas cadastradas', 409);
      }
    }

    const updated = await this.repo.update(id, data);
    return { curso: updated };
  }
}
