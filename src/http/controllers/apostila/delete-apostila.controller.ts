import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaApostilaRepository } from '../../../repositories/prisma/prisma-apostila-repository.js';
import { DeleteApostilaUseCase } from '../../../use-cases/apostila/delete-apostila.js';

export async function deleteApostilaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaApostilaRepository();
  const useCase = new DeleteApostilaUseCase(repo);

  await useCase.execute(id);
  return reply.status(204).send();
}
