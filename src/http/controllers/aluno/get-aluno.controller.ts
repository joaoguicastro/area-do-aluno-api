import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { GetAlunoUseCase } from '../../../use-cases/aluno/get-aluno.js';

export async function getAlunoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaAlunosRepository();
  const useCase = new GetAlunoUseCase(repo);

  const { aluno } = await useCase.execute(id);
  return reply.send({ aluno });
}
