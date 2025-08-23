import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';
import { PublishProvaUseCase } from '../../../use-cases/prova/publish-prova.js';

export async function publishProvaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({ publicado: z.boolean() });

  const { id } = paramsSchema.parse(req.params);
  const { publicado } = bodySchema.parse(req.body);

  const repo = new PrismaProvasRepository();
  const useCase = new PublishProvaUseCase(repo);

  const { prova } = await useCase.execute(id, publicado);
  return reply.send({ prova });
}
