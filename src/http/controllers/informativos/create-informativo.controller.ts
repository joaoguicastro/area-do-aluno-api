import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaInformativosRepository } from '../../../repositories/prisma/prisma-informativos-repository.js';
import { CreateInformativoUseCase } from '../../../use-cases/informativos/create-informativo.js';

export async function createInformativoController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    titulo: z.string().min(2),
    conteudo: z.string().min(2),
    publicado: z.boolean().optional(),
    cursoId: z.string().min(1).optional().nullable(),
    turmaId: z.string().min(1).optional().nullable(),
  });

  const user: any = (req as any).user;
  if (!user || user.role === 'aluno') {
    return reply.status(403).send({ message: 'Apenas funcionários podem criar informativos.' });
  }

  const b = bodySchema.parse((req as any).body);

  const payload = {
    titulo: b.titulo,
    conteudo: b.conteudo,
    publicado: b.publicado ?? true,
    cursoId: b.cursoId ?? null,
    turmaId: b.turmaId ?? null,
  };

  const useCase = new CreateInformativoUseCase(new PrismaInformativosRepository());
  const { informativo } = await useCase.execute(payload);

  return reply.status(201).send({ informativo });
}
