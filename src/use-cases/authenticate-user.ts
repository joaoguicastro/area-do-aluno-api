import { UsersRepository } from '../repositories/users-repository.js';
import { AppError } from '../http/errors/app-error.js';
import { comparePassword } from '../utils/hash.js';

interface AuthInput {
  email: string;
  senha: string;
}

export class AuthenticateUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute({ email, senha }: AuthInput) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) throw new AppError('Credenciais inválidas', 401);

    const match = await comparePassword(senha, user.senhaHash);
    if (!match) throw new AppError('Credenciais inválidas', 401);

    return { user };
  }
}
