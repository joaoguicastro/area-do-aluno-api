import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { CreateCursoUseCase } from '../../../use-cases/curso/create-curso.js';
import type { CreateCursoInput } from '../../../repositories/cursos-repository.js';

export async function createCursoController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    nome: z.string().min(2),
    modality: z.enum(['ONLINE', 'PRESENCIAL']),
    duracaoHoras: z.coerce.number().int().positive().optional(),
  });

  const data = bodySchema.parse(req.body);

  const input: CreateCursoInput = {
    nome: data.nome,
    modality: data.modality,
    duracaoHoras: data.duracaoHoras ?? null,
  };

  const repo = new PrismaCursosRepository();
  const useCase = new CreateCursoUseCase(repo);

  const { curso } = await useCase.execute(input);
  return reply.status(201).send({ curso });
}
