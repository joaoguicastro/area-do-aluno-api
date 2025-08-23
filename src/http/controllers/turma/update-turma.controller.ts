import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { UpdateTurmaUseCase } from '../../../use-cases/turma/update-turma.js';
import type { UpdateTurmaInput } from '../../../repositories/turmas-repository.js';

export async function updateTurmaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({
    nome: z.string().min(1).optional(),
    capacidade: z.coerce.number().int().positive().optional(),
  });

  const { id } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const payload: UpdateTurmaInput = {};
  if (data.nome !== undefined) payload.nome = data.nome;
  if (data.capacidade !== undefined) payload.capacidade = data.capacidade;

  const turmasRepo = new PrismaTurmasRepository();
  const useCase = new UpdateTurmaUseCase(turmasRepo);

  const { turma } = await useCase.execute(id, payload);
  return reply.send({ turma });
}
