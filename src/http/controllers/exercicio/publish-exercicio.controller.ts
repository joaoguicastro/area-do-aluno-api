import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaExerciciosRepository } from '../../../repositories/prisma/prisma-exercicios-repository.js';
import { PublishExercicioUseCase } from '../../../use-cases/exercicio/publish-exercicio.js';

export async function publishExercicioController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({ publicado: z.boolean() });

  const { id } = paramsSchema.parse(req.params);
  const { publicado } = bodySchema.parse(req.body);

  const repo = new PrismaExerciciosRepository();
  const useCase = new PublishExercicioUseCase(repo);

  const { exercicio } = await useCase.execute(id, publicado);
  return reply.send({ exercicio });
}
