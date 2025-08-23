import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';
import { RespondQuestaoUseCase } from '../../../use-cases/prova/respond-questao.js';

export async function respondQuestaoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ submissaoId: z.string().min(1) });
  const bodySchema = z.object({
    questaoId: z.string().min(1),
    opcaoId: z.string().optional().nullable(),
    respostaTxt: z.string().optional().nullable(),
  });

  const { submissaoId } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const repo = new PrismaProvasRepository();
  const useCase = new RespondQuestaoUseCase(repo);

  const { resposta } = await useCase.execute(submissaoId, data.questaoId, {
    opcaoId: data.opcaoId ?? null,
    respostaTxt: data.respostaTxt ?? null,
  });

  return reply.status(201).send({ resposta });
}
