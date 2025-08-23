import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaMatriculasRepository } from '../../../repositories/prisma/prisma-matriculas-repository.js';
import { GetMatriculaUseCase } from '../../../use-cases/matricula/get-matricula.js';

export async function getMatriculaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse(req.params);

  const repo = new PrismaMatriculasRepository();
  const useCase = new GetMatriculaUseCase(repo);

  const { matricula } = await useCase.execute(id);
  return reply.send({ matricula });
}
