import type { FastifyInstance } from 'fastify';

export async function debugRoutes(app: FastifyInstance) {
  app.get('/__debug/whoami', { preHandler: [app.authenticate] }, (req, reply) => {
    reply.send({ user: (req as any).user });
  });
}
