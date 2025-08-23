import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { CreateProvaUseCase } from '../../../use-cases/prova/create-prova.js';
import type { CreateProvaInput } from '../../../repositories/provas-repository.js';

export async function createProvaController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    cursoId: z.string().min(1),
    titulo: z.string().min(2),
    descricao: z.string().optional(),
    inicioEm: z.coerce.date().optional(),
    fimEm: z.coerce.date().optional(),
    duracaoMin: z.coerce.number().int().positive().optional(),
    publicado: z.boolean().optional(),
  });

  const data = bodySchema.parse(req.body);

  const input: CreateProvaInput = {
    cursoId: data.cursoId,
    titulo: data.titulo,
    descricao: data.descricao ?? null,
    inicioEm: data.inicioEm ?? null,
    fimEm: data.fimEm ?? null,
    duracaoMin: data.duracaoMin ?? null,
    publicado: data.publicado ?? false,
  };

  const repo = new PrismaProvasRepository();
  const cursosRepo = new PrismaCursosRepository();
  const useCase = new CreateProvaUseCase(repo, cursosRepo);

  const { prova } = await useCase.execute(input);
  return reply.status(201).send({ prova });
}
