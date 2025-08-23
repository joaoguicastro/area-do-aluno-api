import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { GetCursoUseCase } from '../../../use-cases/curso/get-curso.js';

export async function getCursoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaCursosRepository();
  const useCase = new GetCursoUseCase(repo);

  const { curso } = await useCase.execute(id);
  return reply.send({ curso });
}
