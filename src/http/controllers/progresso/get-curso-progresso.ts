import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProgressoRepository } from '../../../repositories/prisma/prisma-progresso-repository.js';
import { GetCursoProgressoUseCase } from '../../../use-cases/progresso/get-curso-progresso.js';

export async function getCursoProgressoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ cursoId: z.string().min(1) });
  const { cursoId } = paramsSchema.parse(req.params);

  const alunoId = (req as any).user?.sub as string | undefined;
  if (!alunoId) return reply.status(401).send({ message: 'token inválido' });

  const repo = new PrismaProgressoRepository();
  const useCase = new GetCursoProgressoUseCase(repo);
  const result = await useCase.execute({ alunoId, cursoId });

  return reply.send(result);
}
