import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaModulosRepository } from '../../../repositories/prisma/prisma-modulos-repository.js';
import { CreateModuloUseCase } from '../../../use-cases/modulo/create-modulo.js';

export async function createModuloController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    cursoId: z.string().min(1),
    nome: z.string().min(2),
    ordem: z.coerce.number().int().positive().optional(),
  });

  const data = bodySchema.parse(req.body);

  const repo = new PrismaModulosRepository();
  const useCase = new CreateModuloUseCase(repo);

  const { modulo } = await useCase.execute({
    cursoId: data.cursoId,
    nome: data.nome,
    ordem: data.ordem ?? null,
  });

  return reply.status(201).send({ modulo });
}
