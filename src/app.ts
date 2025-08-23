import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './env/index.js';
import { errorHandler } from './http/errors/error-handler.js';
import { authRoutes } from './http/routes/auth.routes.js';
import { cursosRoutes } from './http/routes/cursos.routes.js';
import { turmasRoutes } from './http/routes/turmas.routes.js';
import { alunosRoutes } from './http/routes/alunos.routes.js';
import { matriculasRoutes } from './http/routes/matriculas.routes.js';
import { exerciciosRoutes } from './http/routes/exercicios.routes.js';
import { provasRoutes } from './http/routes/provas.routes.js';

export const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(jwt, { secret: env.JWT_SECRET });

app.get('/', async () => {
  return { ok: true, at: new Date().toISOString(), env: env.NODE_ENV };
});

app.register(authRoutes);
app.register(cursosRoutes);
app.register(turmasRoutes);
app.register(alunosRoutes);
app.register(matriculasRoutes);
app.register(provasRoutes);
app.register(exerciciosRoutes);

app.setErrorHandler(errorHandler);
