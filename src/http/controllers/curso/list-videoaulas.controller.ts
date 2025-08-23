import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { ListVideoAulasUseCase } from '../../../use-cases/curso/list-videoaulas.js';

export async function listVideoAulasController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ cursoId: z.string().min(1) });
  const { cursoId } = paramsSchema.parse(req.params);

  const repo = new PrismaCursosRepository();
  const useCase = new ListVideoAulasUseCase(repo);

  const { videos } = await useCase.execute(cursoId);
  return reply.send({ videos });
}
