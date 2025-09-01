import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaModulosRepository } from '../../../repositories/prisma/prisma-modulos-repository.js';
import { DeleteModuloUseCase } from '../../../use-cases/modulo/delete-modulo.js';

export async function deleteModuloController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaModulosRepository();
  const useCase = new DeleteModuloUseCase(repo);
  const result = await useCase.execute(id);

  return reply.send(result);
}
