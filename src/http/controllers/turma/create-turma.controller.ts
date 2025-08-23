import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { CreateTurmaUseCase } from '../../../use-cases/turma/create-turma.js';
import type { CreateTurmaInput } from '../../../repositories/turmas-repository.js';

export async function createTurmaController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    cursoId: z.string().min(1),
    nome: z.string().min(1).optional(),
    capacidade: z.coerce.number().int().positive().optional(),
  });

  const data = bodySchema.parse(req.body);

  const input: CreateTurmaInput = {
    cursoId: data.cursoId,
    nome: data.nome ?? null,
    capacidade: data.capacidade ?? null,
  };

  const turmasRepo = new PrismaTurmasRepository();
  const cursosRepo = new PrismaCursosRepository();
  const useCase = new CreateTurmaUseCase(turmasRepo, cursosRepo);

  const { turma } = await useCase.execute(input);
  return reply.status(201).send({ turma });
}
