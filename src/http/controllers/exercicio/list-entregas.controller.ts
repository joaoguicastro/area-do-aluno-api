import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaExerciciosRepository } from '../../../repositories/prisma/prisma-exercicios-repository.js';

export async function listEntregasController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ exercicioId: z.string().min(1) });
  const { exercicioId } = paramsSchema.parse(req.params);

  const repo = new PrismaExerciciosRepository();
  const entregas = await repo.listEntregas(exercicioId);

  return reply.send({ entregas });
}
