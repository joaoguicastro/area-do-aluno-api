import { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';

import { createCursoController } from '../controllers/curso/create-curso.controller.js';
import { listCursosController } from '../controllers/curso/list-cursos.controller.js';
import { getCursoController } from '../controllers/curso/get-curso.controller.js';
import { updateCursoController } from '../controllers/curso/update-curso.controller.js';
import { deleteCursoController } from '../controllers/curso/delete-curso.controller.js';

import { addVideoAulaController } from '../controllers/curso/add-videoaula.controller.js';
import { listVideoAulasController } from '../controllers/curso/list-videoaulas.controller.js';
import { removeVideoAulaController } from '../controllers/curso/remove-videoaula.controller.js';
import { listVideoAulasAlunoController } from '../controllers/curso/list-videoaulas-aluno.controller.js';

export async function cursosRoutes(app: FastifyInstance) {
  app.addHook('onRequest', ensureAuth);

  app.post('/cursos', createCursoController);
  app.get('/cursos', listCursosController);
  app.get('/cursos/:id', getCursoController);
  app.patch('/cursos/:id', updateCursoController);
  app.delete('/cursos/:id', deleteCursoController);

  app.post('/cursos/:cursoId/videoaulas', addVideoAulaController);
  app.get('/cursos/:cursoId/videoaulas',listVideoAulasController);
  app.delete('/cursos/:cursoId/videoaulas/:videoAulaId', removeVideoAulaController);
  app.get('/cursos/:cursoId/aluno/videoaulas',listVideoAulasAlunoController);
}
