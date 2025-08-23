import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaMatriculasRepository } from '../../../repositories/prisma/prisma-matriculas-repository.js';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';
import { CreateMatriculaUseCase } from '../../../use-cases/matricula/create-matricula.js';
import type { CreateMatriculaInput } from '../../../repositories/matriculas-repository.js';

export async function createMatriculaController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    alunoId: z.string().min(1),
    cursoId: z.string().min(1),
    turmaId: z.string().optional(),             
    status: z.enum(['ATIVA', 'TRANCADA', 'CANCELADA', 'CONCLUIDA']).optional(),
    dataInicio: z.coerce.date().optional(),
    dataFim: z.coerce.date().optional(),
  });

  const data = bodySchema.parse(req.body);

  const input: CreateMatriculaInput = {
    alunoId: data.alunoId,
    cursoId: data.cursoId,
    turmaId: data.turmaId ?? null,
    status: data.status ?? 'ATIVA',
  };

  if (data.dataInicio !== undefined) {
    input.dataInicio = data.dataInicio;
  }
  if (data.dataFim !== undefined) {
    input.dataFim = data.dataFim ?? null;
  }

  const repo = new PrismaMatriculasRepository();
  const alunosRepo = new PrismaAlunosRepository();
  const cursosRepo = new PrismaCursosRepository();
  const turmasRepo = new PrismaTurmasRepository();

  const useCase = new CreateMatriculaUseCase(repo, alunosRepo, cursosRepo, turmasRepo);

  const { matricula } = await useCase.execute(input);
  return reply.status(201).send({ matricula });
}
