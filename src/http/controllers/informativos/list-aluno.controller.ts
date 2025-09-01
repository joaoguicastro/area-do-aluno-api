import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaInformativosRepository } from '../../../repositories/prisma/prisma-informativos-repository.js';
import { ListInformativosDoAlunoUseCase } from '../../../use-cases/informativos/list-informativos-aluno.js';

export async function listInformativosAlunoController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
  });
  const { q, page, perPage } = querySchema.parse((req as any).query);

  const user: any = (req as any).user;
  if (!user || user.role !== 'aluno') {
    return reply.status(403).send({ message: 'Apenas alunos podem acessar /me/informativos.' });
  }
  const alunoId: string = user.sub ?? user.alunoId;

  const useCase = new ListInformativosDoAlunoUseCase(new PrismaInformativosRepository());
  const result = await useCase.execute(alunoId, { q, page, perPage });

  return reply.send(result);
}
