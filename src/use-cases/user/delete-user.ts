import type { UsersRepository } from '../../repositories/users-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class DeleteUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute({ id }: { id: string }) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    await this.usersRepo.delete({ id });
    return { ok: true };
  }
}
