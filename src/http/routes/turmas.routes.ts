import { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';

import { createTurmaController } from '../controllers/turma/create-turma.controller.js';
import { listTurmasController } from '../controllers/turma/list-turmas.controller.js';
import { getTurmaController } from '../controllers/turma/get-turma.controller.js';
import { updateTurmaController } from '../controllers/turma/update-turma.controller.js';
import { deleteTurmaController } from '../controllers/turma/delete-turma.controller.js';

import { addHorarioController } from '../controllers/turma/add-horario.controller.js';
import { listHorariosController } from '../controllers/turma/list-horarios.controller.js';
import { removeHorarioController } from '../controllers/turma/remove-horario.controller.js';
import { getTurmaCursoController } from '../controllers/turma/get-turma-curso.controller.js';

export async function turmasRoutes(app: FastifyInstance) {
  app.addHook('onRequest', ensureAuth);

  app.post('/turmas', createTurmaController);
  app.get('/turmas', listTurmasController);
  app.get('/turmas/:id', getTurmaController);
  app.get('/turmas/curso/:cursoId', getTurmaCursoController);
  app.patch('/turmas/:id', updateTurmaController);
  app.delete('/turmas/:id', deleteTurmaController);

  app.post('/turmas/:turmaId/horarios', addHorarioController);
  app.get('/turmas/:turmaId/horarios', listHorariosController);
  app.delete('/turmas/:turmaId/horarios/:horarioId', removeHorarioController);
}
