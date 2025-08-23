import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { DeleteAlunoUseCase } from '../../../use-cases/aluno/delete-aluno.js';

export async function deleteAlunoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaAlunosRepository();
  const useCase = new DeleteAlunoUseCase(repo);

  await useCase.execute(id);
  return reply.status(204).send();
}
