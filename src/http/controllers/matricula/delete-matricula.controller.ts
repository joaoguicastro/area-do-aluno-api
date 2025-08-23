import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaMatriculasRepository } from '../../../repositories/prisma/prisma-matriculas-repository.js';
import { DeleteMatriculaUseCase } from '../../../use-cases/matricula/delete-matricula.js';

export async function deleteMatriculaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaMatriculasRepository();
  const useCase = new DeleteMatriculaUseCase(repo);

  await useCase.execute(id);
  return reply.status(204).send();
}
