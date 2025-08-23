import { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';

import { createExercicioController } from '../controllers/exercicio/create-exercicio.controller.js';
import { listExerciciosController } from '../controllers/exercicio/list-exercicios.controller.js';
import { publishExercicioController } from '../controllers/exercicio/publish-exercicio.controller.js';
import { submitEntregaController } from '../controllers/exercicio/submit-entrega.controller.js';
import { listEntregasController } from '../controllers/exercicio/list-entregas.controller.js';

export async function exerciciosRoutes(app: FastifyInstance) {
  app.addHook('onRequest', ensureAuth);

  app.post('/exercicios', createExercicioController);
  app.get('/exercicios', listExerciciosController);
  app.patch('/exercicios/:id/publicar', publishExercicioController);

  app.post('/exercicios/:exercicioId/entregas', submitEntregaController);
  app.get('/exercicios/:exercicioId/entregas', listEntregasController);
}
