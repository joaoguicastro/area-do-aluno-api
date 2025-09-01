import type { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';
import { createInformativoController } from '../controllers/informativos/create-informativo.controller.js';
import { listInformativosAdminController } from '../controllers/informativos/list-admin.controller.js';
import { listInformativosAlunoController } from '../controllers/informativos/list-aluno.controller.js';
import { deleteInformativoController } from '../controllers/informativos/delete-informativo.controller.js';

export async function informativosRoutes(app: FastifyInstance) {
  app.get('/informativos', {preHandler: ensureAuth}, listInformativosAdminController);
  app.post('/informativos', {preHandler: ensureAuth}, createInformativoController);
  app.delete('/informativos/:id', {preHandler: ensureAuth}, deleteInformativoController);

  app.get('/me/informativos', {preHandler: ensureAuth}, listInformativosAlunoController);
}
