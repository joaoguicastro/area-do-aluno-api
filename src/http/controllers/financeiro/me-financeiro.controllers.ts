// src/http/controllers/financeiro/me-financeiro.controllers.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { checkInadimplencia } from '../../../use-cases/financeiro/check-inadimplencia.js';
import { AppError } from '../../errors/app-error.js';
import { listParcelasDoAluno } from '../../../use-cases/financeiro/list-parcelas-do-aluno.js';

function getAlunoIdFromReq(req: FastifyRequest): string {
  const u: any = (req as any).user ?? (req as any).user?.user ?? {};

  const alunoId =
    u.sub ??
    u.alunoId ??
    u.aluno?.id ??
    null;

  if (!alunoId) {
    throw new AppError('Aluno não autenticado', 401);
  }
  return String(alunoId);
}

export async function getFinanceGateController(req: FastifyRequest, reply: FastifyReply) {
  const alunoId = getAlunoIdFromReq(req);
  const r = await checkInadimplencia(alunoId);
  return reply.send({
    requireFinance: r.requireFinance,
    diasMaxAtraso: r.diasMaxAtraso,
    maiorAtrasoDias: r.maiorAtrasoDias,
    vencidas: r.vencidas,
    totalVencido: r.totalVencido,
  });
}

export async function listMinhasParcelasController(req: FastifyRequest, reply: FastifyReply) {
  const alunoId = getAlunoIdFromReq(req);
  const r = await listParcelasDoAluno(alunoId);
  return reply.send(r);
}
