import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { AddHorarioUseCase } from '../../../use-cases/turma/add-horario.js';
import type { CreateHorarioInput } from '../../../repositories/turmas-repository.js';

export async function addHorarioController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ turmaId: z.string().min(1) });
  const bodySchema = z.object({
    diaSemana: z.coerce.number().int().min(0).max(6),
    inicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm'),
    fim: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:mm'),
  });

  const { turmaId } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const input: CreateHorarioInput = {
    diaSemana: data.diaSemana,
    inicio: data.inicio,
    fim: data.fim,
  };

  const turmasRepo = new PrismaTurmasRepository();
  const cursosRepo = new PrismaCursosRepository();
  const useCase = new AddHorarioUseCase(turmasRepo, cursosRepo);

  const { horario } = await useCase.execute(turmaId, input);
  return reply.status(201).send({ horario });
}
