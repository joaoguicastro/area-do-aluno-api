import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { UpdateCursoUseCase } from '../../../use-cases/curso/update-curso.js';
import type { UpdateCursoInput } from '../../../repositories/cursos-repository.js';

export async function updateCursoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({
    nome: z.string().min(2).optional(),
    modality: z.enum(['ONLINE', 'PRESENCIAL']).optional(),
    duracaoHoras: z.coerce.number().int().positive().optional(),
  });

  const { id } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const payload: UpdateCursoInput = {};
  if (data.nome !== undefined) payload.nome = data.nome;
  if (data.modality !== undefined) payload.modality = data.modality;
  if (data.duracaoHoras !== undefined) payload.duracaoHoras = data.duracaoHoras;

  const repo = new PrismaCursosRepository();
  const useCase = new UpdateCursoUseCase(repo);

  const { curso } = await useCase.execute(id, payload);
  return reply.send({ curso });
}
