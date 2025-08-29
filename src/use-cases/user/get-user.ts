import type { UsersRepository } from '../../repositories/users-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class GetUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute({ id }: { id: string }) {
    const user = await this.usersRepo.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    return { user };
  }
}
