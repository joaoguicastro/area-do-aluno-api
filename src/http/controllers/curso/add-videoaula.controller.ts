import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { AddVideoAulaUseCase } from '../../../use-cases/curso/add-videoaula.js';
import type { CreateVideoAulaInput } from '../../../repositories/cursos-repository.js';

function parseDateLocalISO(dateStr?: string | null) {
  if (!dateStr) return null;
  // Espera 'YYYY-MM-DD' do front (input type="date")
  // Garante 00:00 no fuso de Fortaleza (-03:00)
  return new Date(`${dateStr}T00:00:00-03:00`);
}

export async function addVideoAulaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ cursoId: z.string().min(1) });
  const bodySchema = z.object({
    titulo: z.string().min(2),
    descricao: z.string().optional(),
    urlVideo: z.string().url(),
    ordem: z.coerce.number().int().positive().optional(),
    duracaoMin: z.coerce.number().int().positive().optional(),
    moduloId: z.string().min(1).optional(),
    liberarEm: z.string().optional()
  });

  const { cursoId } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const input: CreateVideoAulaInput = {
    titulo: data.titulo,
    urlVideo: data.urlVideo,
    descricao: data.descricao ?? null,
    ordem: data.ordem ?? null,
    duracaoMin: data.duracaoMin ?? null,
    moduloId: data.moduloId ?? null,
    liberarEm: data.liberarEm ? new Date(
      data.liberarEm.length === 10 ? `${data.liberarEm}T00:00:00` : data.liberarEm
    ) : null,

  };

  const repo = new PrismaCursosRepository();
  const useCase = new AddVideoAulaUseCase(repo);

  const { video } = await useCase.execute(cursoId, input);
  return reply.status(201).send({ video });
}
