import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';
import { AddQuestaoUseCase } from '../../../use-cases/prova/add-questao.js';

export async function addQuestaoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ provaId: z.string().min(1) });
  const bodySchema = z.object({
    tipo: z.enum(['MULTIPLA_ESCOLHA', 'DISSERTATIVA']),
    enunciado: z.string().min(2),
    valor: z.coerce.number().positive().optional(),
    ordem: z.coerce.number().int().positive().optional(),
  });

  const { provaId } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const repo = new PrismaProvasRepository();
  const useCase = new AddQuestaoUseCase(repo);

  const { questao } = await useCase.execute(provaId, {
    tipo: data.tipo,
    enunciado: data.enunciado,
    valor: data.valor ?? null,
    ordem: data.ordem ?? null,
  });

  return reply.status(201).send({ questao });
}
