import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaInformativosRepository } from '../../../repositories/prisma/prisma-informativos-repository.js';
import { ListInformativosAdminUseCase } from '../../../use-cases/informativos/list-informativos-admin.js';

export async function listInformativosAdminController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
  });
  const { q, page, perPage } = querySchema.parse((req as any).query);

  const user: any = (req as any).user;
  if (!user || user.role === 'aluno') {
    return reply.status(403).send({ message: 'Apenas funcionários podem listar informativos.' });
  }

  const useCase = new ListInformativosAdminUseCase(new PrismaInformativosRepository());
  const result = await useCase.execute({ q, page, perPage });

  return reply.send(result);
}
