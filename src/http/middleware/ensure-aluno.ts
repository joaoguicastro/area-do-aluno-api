// src/http/middlewares/ensure-aluno.ts
import { FastifyReply, FastifyRequest } from 'fastify';

export async function ensureAluno(req: FastifyRequest, reply: FastifyReply) {
  // suporta tokens com payload { sub, role } ou { user: { sub, role } }
  const raw = (req as any).user;
  const u = raw?.user ?? raw;

  if (!u) {
    return reply.code(401).send({ message: 'Aluno não autenticado' });
  }

  const role = String(u.role ?? '').toLowerCase();
  if (role !== 'aluno') {
    return reply.code(403).send({ message: 'Apenas ALUNO' });
  }

  // opcional: “anexar” o alunoId para handlers posteriores
  (req as any).alunoId = u.sub ?? u.alunoId ?? null;
}
