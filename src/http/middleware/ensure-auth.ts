import { FastifyReply, FastifyRequest } from 'fastify';

export async function ensureAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ message: 'Token inválido' });
  }
}
