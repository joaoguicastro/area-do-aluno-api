import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository.js';
import { DeleteUserUseCase } from '../../../use-cases/user/delete-user.js';

export async function deleteUserController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse((req as any).params);

  const repo = new PrismaUsersRepository();
  const useCase = new DeleteUserUseCase(repo);

  const result = await useCase.execute({ id });
  return reply.send(result);
}
