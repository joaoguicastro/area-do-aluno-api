import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { AddVideoAulaUseCase } from '../../../use-cases/curso/add-videoaula.js';
import type { CreateVideoAulaInput } from '../../../repositories/cursos-repository.js';

export async function addVideoAulaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ cursoId: z.string().min(1) });
  const bodySchema = z.object({
    titulo: z.string().min(2),
    descricao: z.string().optional(),
    urlVideo: z.string().url(),
    ordem: z.coerce.number().int().positive().optional(),
    duracaoMin: z.coerce.number().int().positive().optional(),
  });

  const { cursoId } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const input: CreateVideoAulaInput = {
    titulo: data.titulo,
    urlVideo: data.urlVideo,
    descricao: data.descricao ?? null,
    ordem: data.ordem ?? null,
    duracaoMin: data.duracaoMin ?? null,
  };

  const repo = new PrismaCursosRepository();
  const useCase = new AddVideoAulaUseCase(repo);

  const { video } = await useCase.execute(cursoId, input);
  return reply.status(201).send({ video });
}
