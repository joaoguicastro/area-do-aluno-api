import { FastifyReply, FastifyRequest } from 'fastify';

export async function alunoAuthGuard(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify(); 
    const payload = req.user as { sub: string; role?: string; };

    if (payload?.role !== 'aluno') {
      return reply.status(403).send({ message: 'Acesso restrito à Área do Aluno.' });
    }
  } catch {
    return reply.status(401).send({ message: 'Token inválido.' });
  }
}
