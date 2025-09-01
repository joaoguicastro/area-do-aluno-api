import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { ListCursosUseCase } from '../../../use-cases/curso/list-cursos.js';

export async function listCursosController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(500).default(10),
  });

  const { q, page, perPage } = querySchema.parse((req as any).query);

  const repo = new PrismaCursosRepository();
  const useCase = new ListCursosUseCase(repo);
  const result = await useCase.execute({ page, perPage, ...(q ? { q } : {}) });

  return reply.send(result);
}
