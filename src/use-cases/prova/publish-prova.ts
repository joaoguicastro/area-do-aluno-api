import type { ProvasRepository } from '../../repositories/provas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class PublishProvaUseCase {
  constructor(private repo: ProvasRepository) {}

  async execute(id: string, publicado: boolean) {
    const prova = await this.repo.findById(id);
    if (!prova) throw new AppError('Prova não encontrada', 404);
    const updated = await this.repo.setPublicado(id, publicado);
    return { prova: updated };
  }
}
