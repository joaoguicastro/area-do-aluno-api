import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaExerciciosRepository } from '../../../repositories/prisma/prisma-exercicios-repository.js';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { CreateExercicioUseCase } from '../../../use-cases/exercicio/create-exercicio.js';
import type { CreateExercicioInput } from '../../../repositories/exercicios-repository.js';

export async function createExercicioController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    cursoId: z.string().min(1),
    titulo: z.string().min(2),
    descricao: z.string().optional(),
    dataEntrega: z.coerce.date().optional(),
    publicado: z.boolean().optional(),
  });

  const data = bodySchema.parse(req.body);

  const input: CreateExercicioInput = {
    cursoId: data.cursoId,
    titulo: data.titulo,
    descricao: data.descricao ?? null,
    dataEntrega: data.dataEntrega ?? null,
    publicado: data.publicado ?? false,
  };

  const repo = new PrismaExerciciosRepository();
  const cursosRepo = new PrismaCursosRepository();
  const useCase = new CreateExercicioUseCase(repo, cursosRepo);

  const { exercicio } = await useCase.execute(input);
  return reply.status(201).send({ exercicio });
}
