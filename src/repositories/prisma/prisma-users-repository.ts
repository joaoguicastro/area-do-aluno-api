import { prisma } from '../../core/prisma.js';
import type {
  CreateUserInput,
  UsersRepository,
  User,
  ListUsersParams,
  ListUsersResult,
  UpdateUserInput,
} from '../users-repository.js';

function map(r: any): User {
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

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const r = await prisma.funcionario.findUnique({ where: { email } });
    return r ? map(r) : null;
  }

  async findById(id: string): Promise<User | null> {
    const r = await prisma.funcionario.findUnique({ where: { id } });
    return r ? map(r) : null;
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
    return map(r);
  }

  async delete(data: { id: string }): Promise<void> {
    await prisma.funcionario.delete({ where: { id: data.id } });
  }

  async list(params: ListUsersParams): Promise<ListUsersResult> {
    const { page, perPage, q } = params;
    const where = q
      ? {
          OR: [
            { nome: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      prisma.funcionario.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.funcionario.count({ where }),
    ]);

    return {
      data: rows.map(map),
      total,
      page,
      perPage,
    };
  }

  async update(data: UpdateUserInput): Promise<User> {
    const toUpdate: any = {};
    if (data.nome !== undefined) toUpdate.nome = data.nome;
    if (data.email !== undefined) toUpdate.email = data.email;
    if (data.role !== undefined) toUpdate.role = data.role as any;
    if (data.senhaHash !== undefined) toUpdate.senhaHash = data.senhaHash;

    const r = await prisma.funcionario.update({
      where: { id: data.id },
      data: toUpdate,
    });
    return map(r);
  }
}
