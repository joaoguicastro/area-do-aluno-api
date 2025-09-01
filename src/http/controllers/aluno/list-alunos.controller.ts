import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { ListAlunosUseCase } from '../../../use-cases/aluno/list-alunos.js';

export async function listAlunosController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(500).default(10),
  });

  const { q, page, perPage } = querySchema.parse((req as any).query);

  const repo = new PrismaAlunosRepository();
  const useCase = new ListAlunosUseCase(repo);
  const result = await useCase.execute({ page, perPage, ...(q ? { q } : {}) });

  return reply.send(result);
}
