import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaMatriculasRepository } from '../../../repositories/prisma/prisma-matriculas-repository.js';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { UpdateMatriculaUseCase } from '../../../use-cases/matricula/update-matricula.js';
import type { UpdateMatriculaInput } from '../../../repositories/matriculas-repository.js';

export async function updateMatriculaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({
    turmaId: z.string().nullable().optional(),
    status: z.enum(['ATIVA', 'TRANCADA', 'CANCELADA', 'CONCLUIDA']).optional(),
    dataFim: z.coerce.date().nullable().optional(),
  });

  const { id } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const payload: UpdateMatriculaInput = {};
  if (data.turmaId !== undefined) payload.turmaId = data.turmaId;
  if (data.status !== undefined) payload.status = data.status;
  if (data.dataFim !== undefined) payload.dataFim = data.dataFim;

  const repo = new PrismaMatriculasRepository();
  const turmasRepo = new PrismaTurmasRepository();

  const useCase = new UpdateMatriculaUseCase(repo, turmasRepo);

  const { matricula } = await useCase.execute(id, payload);
  return reply.send({ matricula });
}
