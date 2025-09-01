import type { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';
import { createModuloController } from '../controllers/modulos/create-modulo.controller.js';
import { listModulosDoCursoController } from '../controllers/modulos/list-modulos.controller.js';
import { updateModuloController } from '../controllers/modulos/update-modulo.controller.js';
import { deleteModuloController } from '../controllers/modulos/delete-modulo.controller.js';

export async function modulosRoutes(app: FastifyInstance) {
  app.get('/cursos/:cursoId/modulos', { preHandler: [ensureAuth] }, listModulosDoCursoController);
  app.post('/cursos/:cursoId/modulos', { preHandler: [ensureAuth] }, createModuloController);
  app.patch('/modulos/:id', { preHandler: [ensureAuth] }, updateModuloController);
  app.delete('/modulos/:id', { preHandler: [ensureAuth] }, deleteModuloController);
}
