import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { ListAlunosUseCase } from '../../../use-cases/aluno/list-alunos.js';

export async function listAlunosController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
  });

  const { q, page, perPage } = querySchema.parse(req.query);

  const repo = new PrismaAlunosRepository();
  const useCase = new ListAlunosUseCase(repo);

  const args: { q?: string; page?: number; perPage?: number } = { page, perPage };
  if (q !== undefined) args.q = q;

  const result = await useCase.execute(args);
  return reply.send(result);
}
