import type { CursosRepository } from '../../repositories/cursos-repository.js';

export class RemoveVideoAulaUseCase {
  constructor(private repo: CursosRepository) {}

  async execute(videoAulaId: string) {
    await this.repo.removeVideoAula(videoAulaId);
    return { ok: true };
  }
}
