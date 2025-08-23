import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { RemoveVideoAulaUseCase } from '../../../use-cases/curso/remove-videoaula.js';

export async function removeVideoAulaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    cursoId: z.string().min(1),         
    videoAulaId: z.string().min(1),
  });

  const { videoAulaId } = paramsSchema.parse(req.params);

  const repo = new PrismaCursosRepository();
  const useCase = new RemoveVideoAulaUseCase(repo);

  await useCase.execute(videoAulaId);
  return reply.status(204).send();
}
