import type { UsersRepository } from '../../repositories/users-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class DeleteUserUseCase {
  private repo: UsersRepository;

  constructor(repo: UsersRepository) {
    this.repo = repo;
  }

  async execute({ id }: { id: string }) {
    const user = await this.repo.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    await this.repo.delete({ id });
    return { message: 'Usuário excluído com sucesso' };
  }
}
