import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { GetTurmaCursoUseCase } from '../../../use-cases/turma/get-turma-curso.js';

export async function getTurmaCursoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    cursoId: z.string().min(1),
  });
  const {cursoId } = paramsSchema.parse(req.params);

  const turmasRepo = new PrismaTurmasRepository();
  const useCase = new GetTurmaCursoUseCase(turmasRepo);

  const { turma } = await useCase.execute(cursoId);
  return reply.send({ turma });
}
