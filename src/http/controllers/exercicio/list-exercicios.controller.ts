import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaExerciciosRepository } from '../../../repositories/prisma/prisma-exercicios-repository.js';
import { ListExerciciosUseCase } from '../../../use-cases/exercicio/list-exercicios.js';

export async function listExerciciosController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    cursoId: z.string().optional(),
    q: z.string().optional(),
    publicados: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
  });

  const { cursoId, q, publicados, page, perPage } = querySchema.parse(req.query);

  const repo = new PrismaExerciciosRepository();
  const useCase = new ListExerciciosUseCase(repo);

  const args: { cursoId?: string; q?: string; publicados?: boolean; page?: number; perPage?: number } = { page, perPage };
  if (cursoId !== undefined) args.cursoId = cursoId;
  if (q !== undefined) args.q = q;
  if (publicados !== undefined) args.publicados = publicados;

  const result = await useCase.execute(args);
  return reply.send(result);
}
