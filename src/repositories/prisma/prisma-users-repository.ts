import { prisma } from '../../core/prisma.js';
import type { CreateUserInput, UsersRepository, User } from '../users-repository.js';

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const r = await prisma.funcionario.findUnique({ where: { email } });
    if (!r) return null;

    return {
      id: r.id,
      nome: r.nome,
      email: r.email,
      senhaHash: r.senhaHash,
      role: r.role as any,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
    }

  async create(data: CreateUserInput): Promise<User> {
    const r = await prisma.funcionario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        role: data.role as any,
      },
    });

    return {
      id: r.id,
      nome: r.nome,
      email: r.email,
      senhaHash: r.senhaHash,
      role: r.role as any,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }
}
