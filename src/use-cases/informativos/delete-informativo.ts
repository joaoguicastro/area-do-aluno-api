import type { InformativosRepository } from '../../repositories/informativos-repository.js';
import { AppError } from '../../http/errors/app-error.js';
import { prisma } from '../../core/prisma.js';

export class DeleteInformativoUseCase {
  private repo: InformativosRepository;
  constructor(repo: InformativosRepository) {
    this.repo = repo;
  }

  async execute(id: string) {
    const exists = await prisma.informativo.findUnique({ where: { id } });
    if (!exists) throw new AppError('Informativo não encontrado', 404);
    await this.repo.delete(id);
    return { message: 'Informativo removido com sucesso' };
  }
}
