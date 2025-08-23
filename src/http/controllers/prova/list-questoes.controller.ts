import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProvasRepository } from '../../../repositories/prisma/prisma-provas-repository.js';

export async function listQuestoesController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ provaId: z.string().min(1) });
  const { provaId } = paramsSchema.parse(req.params);

  const repo = new PrismaProvasRepository();
  const qs = await repo.listQuestoesComOpcoes(provaId);
  return reply.send({ questoes: qs });
}
