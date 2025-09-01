import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import fs from 'node:fs';
import { env } from './env/index.js';
import { errorHandler } from './http/errors/error-handler.js';
import { authRoutes } from './http/routes/auth.routes.js';
import { cursosRoutes } from './http/routes/cursos.routes.js';
import { turmasRoutes } from './http/routes/turmas.routes.js';
import { alunosRoutes } from './http/routes/alunos.routes.js';
import { matriculasRoutes } from './http/routes/matriculas.routes.js';
import { exerciciosRoutes } from './http/routes/exercicios.routes.js';
import { provasRoutes } from './http/routes/provas.routes.js';
import { uploadRoutes } from './http/routes/upload.routes.js';
import { progressoRoutes } from './http/routes/progresso.routes.js';
import { informativosRoutes } from './http/routes/informativos.routes.js';
import { modulosRoutes } from './http/routes/modulos.routes.js';

export const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  strictPreflight: false,
});

await app.register(jwt, { secret: env.JWT_SECRET });

await app.register(fastifyMultipart, {
  limits: { files: 1, fileSize: 1024 * 1024 * 1024 },
});

const uploadsRoot = path.join(process.cwd(), 'uploads');
fs.mkdirSync(path.join(uploadsRoot, 'videos'), { recursive: true });

await app.register(fastifyStatic, {
  root: uploadsRoot,
  prefix: '/uploads/',
});

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
app.register(uploadRoutes);
app.register(progressoRoutes);
app.register(informativosRoutes);
app.register(modulosRoutes);

app.setErrorHandler(errorHandler);
