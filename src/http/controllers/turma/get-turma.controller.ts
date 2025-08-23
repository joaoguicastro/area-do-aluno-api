import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { GetTurmaUseCase } from '../../../use-cases/turma/get-turma.js';

export async function getTurmaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const turmasRepo = new PrismaTurmasRepository();
  const useCase = new GetTurmaUseCase(turmasRepo);

  const { turma } = await useCase.execute(id);
  return reply.send({ turma });
}
