import type { UsersRepository, Role } from '../../repositories/users-repository.js';
import { AppError } from '../../http/errors/app-error.js';
import { hashPassword } from '../../utils/hash.js';

type Input = {
  id: string;
  nome?: string;
  email?: string;
  role?: Role;
  senha?: string;
};

export class UpdateUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute({ id, nome, email, role, senha }: Input) {
    const current = await this.usersRepo.findById(id);
    if (!current) throw new AppError('Usuário não encontrado', 404);

    if (email && email !== current.email) {
      const existing = await this.usersRepo.findByEmail(email);
      if (existing && existing.id !== id) {
        throw new AppError('E-mail já cadastrado', 409);
      }
    }

    const senhaHash = senha ? await hashPassword(senha) : undefined;

    const payload: { id: string } & Partial<{ nome: string; email: string; role: Role; senhaHash: string }> = { id };
    if (nome !== undefined) payload.nome = nome;
    if (email !== undefined) payload.email = email;
    if (role !== undefined) payload.role = role;
    if (senhaHash !== undefined) payload.senhaHash = senhaHash;

    const { } = payload;

    const user = await this.usersRepo.update(payload);
    return { user };
  }
}
