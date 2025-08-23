import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';
import { FinalizarSubmissaoUseCase } from '../../../use-cases/prova/finalizar-submissao.js';

export async function finalizarSubmissaoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ submissaoId: z.string().min(1) });
  const { submissaoId } = paramsSchema.parse(req.params);

  const repo = new PrismaProvasRepository();
  const useCase = new FinalizarSubmissaoUseCase(repo);

  const { submissao } = await useCase.execute(submissaoId);
  return reply.send({ submissao });
}
