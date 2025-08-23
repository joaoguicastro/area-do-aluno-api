import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaMatriculasRepository } from '../../../repositories/prisma/prisma-matriculas-repository.js';
import { ListMatriculasUseCase } from '../../../use-cases/matricula/list-matriculas.js';

export async function listMatriculasController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    alunoId: z.string().optional(),
    cursoId: z.string().optional(),
    turmaId: z.string().optional(),
    status: z.enum(['ATIVA', 'TRANCADA', 'CANCELADA', 'CONCLUIDA']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
  });

  const { alunoId, cursoId, turmaId, status, page, perPage } = querySchema.parse(req.query);

  const repo = new PrismaMatriculasRepository();
  const useCase = new ListMatriculasUseCase(repo);

  const args: {
    alunoId?: string; cursoId?: string; turmaId?: string; status?: 'ATIVA'|'TRANCADA'|'CANCELADA'|'CONCLUIDA';
    page?: number; perPage?: number;
  } = { page, perPage };

  if (alunoId !== undefined) args.alunoId = alunoId;
  if (cursoId !== undefined) args.cursoId = cursoId;
  if (turmaId !== undefined) args.turmaId = turmaId;
  if (status !== undefined) args.status = status;

  const result = await useCase.execute(args);
  return reply.send(result);
}
