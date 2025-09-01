import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository.js';
import { UpdateUserUseCase } from '../../../use-cases/user/update-user.js';

export async function updateUserController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({
    nome: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(['MASTER', 'ADMIN', 'OPERADOR', 'PROFESSOR']).optional(),
    senha: z.string().min(6).optional(),
  });

  const { id } = paramsSchema.parse((req as any).params);
  const b = bodySchema.parse((req as any).body);

  // Monte o payload sem undefined (compatível com exactOptionalPropertyTypes)
  const payload: {
    id: string;
    nome?: string;
    email?: string;
    role?: 'MASTER' | 'ADMIN' | 'OPERADOR' | 'PROFESSOR';
    senha?: string;
  } = { id };

  if (b.nome !== undefined) payload.nome = b.nome;
  if (b.email !== undefined) payload.email = b.email;
  if (b.role !== undefined) payload.role = b.role;
  if (b.senha !== undefined) payload.senha = b.senha;

  const useCase = new UpdateUserUseCase(new PrismaUsersRepository());
  const { user } = await useCase.execute(payload);

  return reply.send({
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    updatedAt: user.updatedAt,
  });
}
