import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaModulosRepository } from '../../../repositories/prisma/prisma-modulos-repository.js';
import { ListModulosDoCursoUseCase } from '../../../use-cases/modulo/list-modulos.js';

export async function listModulosDoCursoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ cursoId: z.string().min(1) });
  const { cursoId } = paramsSchema.parse(req.params);

  const repo = new PrismaModulosRepository();
  const useCase = new ListModulosDoCursoUseCase(repo);
  const result = await useCase.execute(cursoId);

  return reply.send(result);
}
