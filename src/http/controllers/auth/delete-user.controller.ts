import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { DeleteUserUseCase } from '../../../use-cases/user/delete-user.js';

export async function deleteUserController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const useCase = new DeleteUserUseCase((req as any).usersRepo ?? undefined as any);
  await useCase.execute({ id });

  return reply.status(204).send();
}
