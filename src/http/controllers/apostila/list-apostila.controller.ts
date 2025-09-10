import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaApostilaRepository } from '../../../repositories/prisma/prisma-apostila-repository.js';
import { ListApostilaUseCase } from '../../../use-cases/apostila/list-apostila.js';

export async function listApostilasController(req: FastifyRequest, reply: FastifyReply) {
    const paramsSchema = z.object({ cursoId: z.string().min(1) });
    const { cursoId } = paramsSchema.parse(req.params);

    const repo = new PrismaApostilaRepository();
    const useCase = new ListApostilaUseCase(repo);
    const result = await useCase.execute(cursoId);

    return reply.send(result);
}
