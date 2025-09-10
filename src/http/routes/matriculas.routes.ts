import { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';

import { createMatriculaController } from '../controllers/matricula/create-matricula.controller.js';
import { listMatriculasController } from '../controllers/matricula/list-matriculas.controller.js';
import { getMatriculaController } from '../controllers/matricula/get-matricula.controller.js';
import { updateMatriculaController } from '../controllers/matricula/update-matricula.controller.js';
import { deleteMatriculaController } from '../controllers/matricula/delete-matricula.controller.js';
import { createMatriculasBulkController } from '../controllers/matricula/bulk-create-matriculas.controller.js';

export async function matriculasRoutes(app: FastifyInstance) {
  app.addHook('onRequest', ensureAuth);

  app.post('/matriculas', createMatriculaController);
  app.post('/matriculas/bulk', createMatriculasBulkController);
  app.get('/matriculas', listMatriculasController);
  app.get('/matriculas/:id', getMatriculaController);
  app.patch('/matriculas/:id', updateMatriculaController);
  app.delete('/matriculas/:id', deleteMatriculaController);
}
