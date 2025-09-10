import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { PrismaMatriculasRepository } from '../../../repositories/prisma/prisma-matriculas-repository.js';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js';
import { PrismaTurmasRepository } from '../../../repositories/prisma/prisma-turmas-repository.js';

import { CreateMatriculaUseCase } from '../../../use-cases/matricula/create-matricula.js';
import { AppError } from '../../errors/app-error.js';
import type { CreateMatriculaInput } from '../../../repositories/matriculas-repository.js';

// schema de um item
const itemSchema = z.object({
  alunoId: z.string().min(1),
  cursoId: z.string().min(1),
  turmaId: z.string().optional().nullable(), // aceita undefined/null
  status: z.enum(['ATIVA', 'TRANCADA', 'CANCELADA', 'CONCLUIDA']).optional(),
  dataInicio: z.coerce.date().optional(),    // aceita 'YYYY-MM-DD'
  dataFim: z.coerce.date().optional().nullable(),
});

// schema do body (aceita array puro ou wrapper { items, continueOnError })
const arraySchema = z.array(itemSchema).min(1).max(1000);
const wrapperSchema = z.object({
  items: arraySchema,
  continueOnError: z.boolean().optional().default(true),
});

function normalizeBody(body: unknown) {
  if (Array.isArray(body)) {
    return { items: arraySchema.parse(body), continueOnError: true };
  }
  return wrapperSchema.parse(body);
}

export async function createMatriculasBulkController(req: FastifyRequest, reply: FastifyReply) {
  const { items, continueOnError } = normalizeBody(req.body);

  const repo = new PrismaMatriculasRepository();
  const alunosRepo = new PrismaAlunosRepository();
  const cursosRepo = new PrismaCursosRepository();
  const turmasRepo = new PrismaTurmasRepository();

  const useCase = new CreateMatriculaUseCase(repo, alunosRepo, cursosRepo, turmasRepo);

  const results: Array<
    | { index: number; status: 'created'; matricula: any }
    | { index: number; status: 'error'; error: string; code?: string }
  > = [];

  let created = 0;
  let failed = 0;

  // execução sequencial para evitar overload/locks
  for (let i = 0; i < items.length; i++) {
    const raw = items[i];

    const input: CreateMatriculaInput = {
      alunoId: raw.alunoId,
      cursoId: raw.cursoId,
      turmaId: raw.turmaId ?? null,
      status: raw.status ?? 'ATIVA',
    };

    if (raw.dataInicio !== undefined) input.dataInicio = raw.dataInicio;
    if (raw.dataFim !== undefined) input.dataFim = raw.dataFim ?? null;

    try {
      const { matricula } = await useCase.execute(input);
      results.push({ index: i, status: 'created', matricula: {
        id: matricula.id,
        alunoId: matricula.alunoId,
        cursoId: matricula.cursoId,
        turmaId: matricula.turmaId,
        status: matricula.status,
        dataInicio: matricula.dataInicio ?? null,
        dataFim: matricula.dataFim ?? null,
      } });
      created++;
    } catch (e: any) {
      failed++;

      // traduz duplicidade (Prisma P2002) ou AppError
      let msg = 'Erro ao criar matrícula.';
      let code: string | undefined;

      if (e?.code === 'P2002') {
        msg = 'Matrícula já existe para este aluno neste curso.';
        code = 'MATRICULA_DUPLICADA';
      } else if (e instanceof AppError) {
        msg = e.message;
      } else if (e?.message) {
        msg = String(e.message);
      }

      results.push({ index: i, status: 'error', error: msg });

      if (!continueOnError) {
        return reply.status(207).send({
          summary: { total: items.length, created, failed },
          results,
        });
      }
    }
  }

  return reply.status(201).send({
    summary: { total: items.length, created, failed },
    results,
  });
}
