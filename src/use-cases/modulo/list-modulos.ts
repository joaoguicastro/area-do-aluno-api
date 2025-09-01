import type { ModulosRepository } from '../../repositories/modulos-repository.js';

export class ListModulosDoCursoUseCase {
  constructor(private repo: ModulosRepository) {}

  async execute(cursoId: string) {
    const data = await this.repo.listByCurso(cursoId);
    return { data, total: data.length };
  }
}
