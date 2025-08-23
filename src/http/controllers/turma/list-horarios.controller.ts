import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { ListHorariosUseCase } from '../../../use-cases/turma/list-horarios.js';

export async function listHorariosController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ turmaId: z.string().min(1) });
  const { turmaId } = paramsSchema.parse(req.params);

  const turmasRepo = new PrismaTurmasRepository();
  const useCase = new ListHorariosUseCase(turmasRepo);

  const { horarios } = await useCase.execute(turmaId);
  return reply.send({ horarios });
}
