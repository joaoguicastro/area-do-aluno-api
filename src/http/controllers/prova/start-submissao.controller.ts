import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';
import { PrismaMatriculasRepository } from '../../../repositories/prisma/prisma-matriculas-repository.js';
import { StartSubmissaoUseCase } from '../../../use-cases/prova/start-submissao.js';

export async function startSubmissaoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ provaId: z.string().min(1) });
  const bodySchema = z.object({ alunoId: z.string().min(1) });

  const { provaId } = paramsSchema.parse(req.params);
  const { alunoId } = bodySchema.parse(req.body);

  const repo = new PrismaProvasRepository();
  const matriculasRepo = new PrismaMatriculasRepository();
  const useCase = new StartSubmissaoUseCase(repo, matriculasRepo);

  const { submissao, resumed } = await useCase.execute(provaId, alunoId);
  return reply.status(resumed ? 200 : 201).send({ submissao, resumed });
}
