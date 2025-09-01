import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { ListVideoAulasLiberadasUseCase } from '../../../use-cases/curso/list-videoaulas-liberadas.js';

export async function listVideoAulasAlunoController(req: FastifyRequest, reply: FastifyReply) {
  // requer ensureAuth
  const paramsSchema = z.object({ cursoId: z.string().min(1) });
  const { cursoId } = paramsSchema.parse(req.params);

  const repo = new PrismaCursosRepository();
  const useCase = new ListVideoAulasLiberadasUseCase(repo);

  const { data } = await useCase.execute(cursoId, new Date());
  return reply.send({ data });
}
