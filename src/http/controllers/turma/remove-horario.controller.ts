import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { RemoveHorarioUseCase } from '../../../use-cases/turma/remove-horario.js';

export async function removeHorarioController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    turmaId: z.string().min(1), 
    horarioId: z.string().min(1),
  });

  const { horarioId } = paramsSchema.parse(req.params);

  const turmasRepo = new PrismaTurmasRepository();
  const useCase = new RemoveHorarioUseCase(turmasRepo);

  await useCase.execute(horarioId);
  return reply.status(204).send();
}
