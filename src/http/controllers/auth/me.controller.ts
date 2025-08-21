import { FastifyReply, FastifyRequest } from 'fastify';

export async function meController(req: FastifyRequest, reply: FastifyReply) {
  return reply.send({ user: req.user });
}
