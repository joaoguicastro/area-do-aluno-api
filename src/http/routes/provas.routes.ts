import { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';

import { createProvaController } from '../controllers/prova/create-prova.controller.js';
import { listProvasController } from '../controllers/prova/list-provas.controller.js';
import { publishProvaController } from '../controllers/prova/publish-prova.controller.js';

import { addQuestaoController } from '../controllers/prova/add-questao.controller.js';
import { addOpcaoController } from '../controllers/prova/add-opcao.controller.js';
import { listQuestoesController } from '../controllers/prova/list-questoes.controller.js';

import { startSubmissaoController } from '../controllers/prova/start-submissao.controller.js';
import { respondQuestaoController } from '../controllers/prova/respond-questao.controller.js';
import { finalizarSubmissaoController } from '../controllers/prova/finalizar-submissao.controller.js';

export async function provasRoutes(app: FastifyInstance) {
  app.addHook('onRequest', ensureAuth);

  app.post('/provas', createProvaController);
  app.get('/provas', listProvasController);
  app.patch('/provas/:id/publicar', publishProvaController);

  app.post('/provas/:provaId/questoes', addQuestaoController);
  app.get('/provas/:provaId/questoes', listQuestoesController);
  app.post('/provas/questoes/:questaoId/opcoes', addOpcaoController);

  app.post('/provas/:provaId/submissoes/start', startSubmissaoController);
  app.post('/provas/submissoes/:submissaoId/responder', respondQuestaoController);
  app.post('/provas/submissoes/:submissaoId/finalizar', finalizarSubmissaoController);
}
