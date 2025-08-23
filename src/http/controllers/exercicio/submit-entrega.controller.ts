import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaExerciciosRepository } from '../../../repositories/prisma/prisma-exercicios-repository.js';
import { PrismaMatriculasRepository } from '../../../repositories/prisma/prisma-matriculas-repository.js';
import { SubmitEntregaUseCase } from '../../../use-cases/exercicio/submit-entrega.js';

export async function submitEntregaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ exercicioId: z.string().min(1) });
  const bodySchema = z.object({
    alunoId: z.string().min(1),
    texto: z.string().optional(),
    arquivoUrl: z.string().url().optional(),
  });

  const { exercicioId } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const repo = new PrismaExerciciosRepository();
  const matriculasRepo = new PrismaMatriculasRepository();
  const useCase = new SubmitEntregaUseCase(repo, matriculasRepo);

  const { entrega, updated } = await useCase.execute(exercicioId, data.alunoId, {
    texto: data.texto ?? null,
    arquivoUrl: data.arquivoUrl ?? null,
  });

  return reply.status(updated ? 200 : 201).send({ entrega, updated });
}
