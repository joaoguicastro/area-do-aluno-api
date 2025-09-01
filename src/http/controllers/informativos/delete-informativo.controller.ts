import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaInformativosRepository } from '../../../repositories/prisma/prisma-informativos-repository.js';
import { DeleteInformativoUseCase } from '../../../use-cases/informativos/delete-informativo.js';

export async function deleteInformativoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const { id } = paramsSchema.parse((req as any).params);

  const user: any = (req as any).user;
  if (!user || user.role === 'aluno') {
    return reply.status(403).send({ message: 'Apenas funcionários podem excluir informativos.' });
  }

  const useCase = new DeleteInformativoUseCase(new PrismaInformativosRepository());
  const result = await useCase.execute(id);

  return reply.send(result);
}
