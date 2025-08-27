import { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';

import { createAlunoController } from '../controllers/aluno/create-aluno.controller.js';
import { listAlunosController } from '../controllers/aluno/list-alunos.controller.js';
import { getAlunoController } from '../controllers/aluno/get-aluno.controller.js';
import { updateAlunoController } from '../controllers/aluno/update-aluno.controller.js';
import { deleteAlunoController } from '../controllers/aluno/delete-aluno.controller.js';
import { alunoMeController } from '../controllers/aluno/me.js';

export async function alunosRoutes(app: FastifyInstance) {
  app.addHook('onRequest', ensureAuth);

  app.post('/alunos', createAlunoController);
  app.get('/alunos', listAlunosController);
  app.get('/alunos/:id', getAlunoController);
  app.patch('/alunos/:id', updateAlunoController);
  app.delete('/alunos/:id', deleteAlunoController);
  app.get('/aluno/me', alunoMeController);
}
