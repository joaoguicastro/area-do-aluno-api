import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { DeleteCursoUseCase } from '../../../use-cases/curso/delete-curso.js';

export async function deleteCursoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaCursosRepository();
  const useCase = new DeleteCursoUseCase(repo);

  await useCase.execute(id);
  return reply.status(204).send();
}
