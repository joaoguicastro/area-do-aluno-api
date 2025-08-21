import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './env/index.js';
import { errorHandler } from './http/errors/error-handler.js';
import { authRoutes } from './http/routes/auth.routes.js';

export const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(jwt, { secret: env.JWT_SECRET });

app.get('/', async () => {
  return { ok: true, at: new Date().toISOString(), env: env.NODE_ENV };
});

app.register(authRoutes);

app.setErrorHandler(errorHandler);
