import { UsersRepository } from '../repositories/users-repository.js';
import { AppError } from '../http/errors/app-error.js';
import type { Role } from '../repositories/users-repository.js';
import { hashPassword } from '../utils/hash.js';

interface RegisterInput {
  nome: string;
  email: string;
  senha: string;
  role: Role;
}

export class RegisterUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute({ nome, email, senha, role }: RegisterInput) {
    const existing = await this.usersRepo.findByEmail(email);
    if (existing) throw new AppError('E-mail já cadastrado', 409);

    const senhaHash = await hashPassword(senha);
    const user = await this.usersRepo.create({ nome, email, senhaHash, role });
    return { user };
  }
}
