import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaApostilaRepository } from '../../../repositories/prisma/prisma-apostila-repository.js';
import { AddApostilaUseCase } from '../../../use-cases/apostila/add-apostila.js';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';

export async function createApostilaController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    titulo: z.string(),
    cursoId: z.string(),
    urlPdf: z.string(),
  });

  const data = bodySchema.parse(req.body);
  const repo = new PrismaApostilaRepository();
  const repoCursos = new PrismaCursosRepository();
    const useCase = new AddApostilaUseCase(repo, repoCursos);
    const apostila = await useCase.execute({
        titulo: data.titulo,
        cursoId: data.cursoId,
        urlPdf: data.urlPdf,
    });
    return reply.status(201).send({ apostila });
}