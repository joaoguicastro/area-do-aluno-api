import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProgressoRepository } from '../../../repositories/prisma/prisma-progresso-repository.js';
import { UpdateVideoAulaProgressoUseCase } from '../../../use-cases/progresso/update-videoaula-progresso.js';

export async function updateVideoAulaProgressoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ cursoId: z.string().min(1) });
  const bodySchema = z.object({
    videoAulaId: z.string().min(1),
    positionSec: z.number().int().min(0).optional(),
    completed: z.boolean().optional(),
  });

  const { cursoId } = paramsSchema.parse(req.params);
  const { videoAulaId, positionSec, completed } = bodySchema.parse(req.body);

  const alunoId = (req as any).user?.sub as string | undefined;
  if (!alunoId) return reply.status(401).send({ message: 'token inválido' });

  const repo = new PrismaProgressoRepository();
  const useCase = new UpdateVideoAulaProgressoUseCase(repo);

  const payload = {
    alunoId,
    cursoId,
    videoAulaId,
    ...(positionSec !== undefined ? { positionSec } : {}),
    ...(completed !== undefined ? { completed } : {}),
  };

  const { progresso } = await useCase.execute(payload);
  return reply.status(200).send({ progresso });
}
