import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository.js';
import { ListUsersUseCase } from '../../../use-cases/user/list-users.js';

export async function listUsersController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(200).default(10),
  });
  const { q, page, perPage } = querySchema.parse((req as any).query);

  const repo = new PrismaUsersRepository();
  const useCase = new ListUsersUseCase(repo);

  const { data, total } = await useCase.execute({ q, page, perPage });
  return reply.send({ data, total, page, perPage });
}
