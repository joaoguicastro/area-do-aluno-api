// src/http/controllers/matricula/list-matriculas.controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../core/prisma.js';

export async function listMatriculasController(req: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    alunoId: z.string().optional(),
    cursoId: z.string().optional(),
    turmaId: z.string().optional(), 
    status: z.enum(['ATIVA', 'TRANCADA', 'CANCELADA', 'CONCLUIDA']).optional(),
  });

  const { alunoId, cursoId, turmaId, status } = querySchema.parse(req.query);

  const where: any = {};
  if (alunoId) where.alunoId = alunoId;
  if (cursoId) where.cursoId = cursoId;
  if (typeof turmaId !== 'undefined') where.turmaId = turmaId === '' ? null : turmaId;
  if (status) where.status = status;

  const items = await prisma.matricula.findMany({
    where,
    orderBy: [{ id: 'desc' }],
  });

  const alunoIds = Array.from(new Set(items.map(m => m.alunoId)));
  const cursoIds = Array.from(new Set(items.map(m => m.cursoId)));
  const turmaIds = Array.from(new Set(items.map(m => m.turmaId).filter(Boolean))) as string[];

  const [alunos, cursos, turmas] = await Promise.all([
    alunoIds.length ? prisma.aluno.findMany({ where: { id: { in: alunoIds } }, select: { id: true, nome: true } }) : Promise.resolve([]),
    cursoIds.length ? prisma.curso.findMany({ where: { id: { in: cursoIds } }, select: { id: true, nome: true, modality: true } }) : Promise.resolve([]),
    turmaIds.length ? prisma.turma.findMany({ where: { id: { in: turmaIds } }, select: { id: true, nome: true } }) : Promise.resolve([]),
  ]);

  const alunoMap = Object.fromEntries(alunos.map(a => [a.id, a.nome]));
  const cursoMap = Object.fromEntries(cursos.map(c => [c.id, { id: c.id, nome: c.nome, modality: c.modality }]));
  const turmaMap = Object.fromEntries(turmas.map(t => [t.id, t.nome]));

  const data = items.map(m => ({
    id: m.id,
    alunoId: m.alunoId,
    cursoId: m.cursoId,
    turmaId: m.turmaId,
    status: m.status,
    dataInicio: m.dataInicio,
    dataFim: m.dataFim,

    alunoNome: alunoMap[m.alunoId] ?? null,
    cursoNome: cursoMap[m.cursoId]?.nome ?? null,
    turmaNome: m.turmaId ? (turmaMap[m.turmaId] ?? null) : null,

    curso: cursoMap[m.cursoId] ?? null,
  }));

  return reply.send({ data });
}
