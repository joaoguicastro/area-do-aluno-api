import type { UsersRepository, UpdateUserInput, Role } from '../../repositories/users-repository.js';
import { AppError } from '../../http/errors/app-error.js';
import { hashPassword } from '../../utils/hash.js';

type Input = {
  id: string;
  nome?: string;
  email?: string;
  role?: Role;
  senha?: string; // texto puro opcional
};

export class UpdateUserUseCase {
  private repo: UsersRepository;

  constructor(repo: UsersRepository) {
    this.repo = repo;
  }

  async execute({ id, nome, email, role, senha }: Input) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new AppError('Usuário não encontrado', 404);

    const patch: UpdateUserInput = { id };

    if (nome !== undefined) patch.nome = nome;
    if (email !== undefined) patch.email = email;
    if (role !== undefined) patch.role = role;

    if (senha !== undefined) {
      if (senha.trim().length < 6) throw new AppError('Senha deve ter ao menos 6 caracteres', 400);
      patch.senhaHash = await hashPassword(senha);
    }

    const keys = Object.keys(patch).filter((k) => k !== 'id');
    if (keys.length === 0) throw new AppError('Nada para atualizar', 400);

    const user = await this.repo.update(patch);
    return { user };
  }
}
