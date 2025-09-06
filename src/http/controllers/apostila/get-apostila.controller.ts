import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaApostilaRepository } from '../../../repositories/prisma/prisma-apostila-repository.js';
import { FindApostilaByIdUseCase } from '../../../use-cases/apostila/findid-apostila.js';

export async function getCursoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaApostilaRepository();
  const useCase = new FindApostilaByIdUseCase(repo);

  const apostila = await useCase.execute(id);
  return reply.send({ apostila });
}