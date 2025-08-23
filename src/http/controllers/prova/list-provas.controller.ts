import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';
import { ListProvasUseCase } from '../../../use-cases/prova/list-provas.js';

export async function listProvasController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    cursoId: z.string().optional(),
    publicados: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
  });

  const { cursoId, publicados, page, perPage } = querySchema.parse(req.query);

  const repo = new PrismaProvasRepository();
  const useCase = new ListProvasUseCase(repo);

  const args: { cursoId?: string; publicados?: boolean; page?: number; perPage?: number } = { page, perPage };
  if (cursoId !== undefined) args.cursoId = cursoId;
  if (publicados !== undefined) args.publicados = publicados;

  const result = await useCase.execute(args);
  return reply.send(result);
}
