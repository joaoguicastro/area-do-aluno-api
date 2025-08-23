import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';
import { AddOpcaoUseCase } from '../../../use-cases/prova/add-opcao.js';

export async function addOpcaoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ questaoId: z.string().min(1) });
  const bodySchema = z.object({
    texto: z.string().min(1),
    correta: z.boolean().optional(),
    ordem: z.coerce.number().int().positive().optional(),
  });

  const { questaoId } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const repo = new PrismaProvasRepository();
  const useCase = new AddOpcaoUseCase(repo);

  const { opcao } = await useCase.execute(questaoId, {
    texto: data.texto,
    correta: data.correta ?? false,
    ordem: data.ordem ?? null,
  });

  return reply.status(201).send({ opcao });
}
