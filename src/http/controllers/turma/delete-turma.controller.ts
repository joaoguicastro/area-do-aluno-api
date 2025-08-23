import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { DeleteTurmaUseCase } from '../../../use-cases/turma/delete-turma.js';

export async function deleteTurmaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const turmasRepo = new PrismaTurmasRepository();
  const useCase = new DeleteTurmaUseCase(turmasRepo);

  await useCase.execute(id);
  return reply.status(204).send();
}
