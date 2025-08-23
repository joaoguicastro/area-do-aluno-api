import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { ListTurmasUseCase } from '../../../use-cases/turma/list-turmas.js';

export async function listTurmasController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    cursoId: z.string().optional(),
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
  });

  const { cursoId, q, page, perPage } = querySchema.parse(req.query);

  const turmasRepo = new PrismaTurmasRepository();
  const useCase = new ListTurmasUseCase(turmasRepo);

  const args: { cursoId?: string; q?: string; page?: number; perPage?: number } = { page, perPage };
  if (cursoId !== undefined) args.cursoId = cursoId;
  if (q !== undefined) args.q = q;

  const result = await useCase.execute(args);
  return reply.send(result);
}
