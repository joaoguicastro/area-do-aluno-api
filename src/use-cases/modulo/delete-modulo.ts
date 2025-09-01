import type { ModulosRepository } from '../../repositories/modulos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class DeleteModuloUseCase {
  constructor(private repo: ModulosRepository) {}

  async execute(id: string) {
    const found = await this.repo.findById(id);
    if (!found) throw new AppError('Módulo não encontrado', 404);

    await this.repo.delete(id);
    return { message: 'Módulo removido.' };
  }
}
