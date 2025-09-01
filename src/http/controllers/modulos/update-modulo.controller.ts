import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaModulosRepository } from '../../../repositories/prisma/prisma-modulos-repository.js';
import { UpdateModuloUseCase } from '../../../use-cases/modulo/update-modulo.js';

export async function updateModuloController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({
    nome: z.string().min(2).optional(),             
    ordem: z.coerce.number().int().positive().nullable().optional(), 
  });

  const { id } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const repo = new PrismaModulosRepository();
  const useCase = new UpdateModuloUseCase(repo);

  const payload: { id: string; nome?: string; ordem?: number | null } = { id };
  if (data.nome !== undefined) payload.nome = data.nome;
  if (data.ordem !== undefined) payload.ordem = data.ordem; 

  const { modulo } = await useCase.execute(payload);
  return reply.send({ modulo });
}
