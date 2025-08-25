import { FastifyInstance } from 'fastify';
import { alunoLoginController } from '../controllers/aluno/login.js';
import { alunoMeController } from '../controllers/aluno/me.js';
import { alunoAuthGuard } from '../middleware/aluno-auth-guard.js';

export async function alunoRoutes(app: FastifyInstance) {
  app.post('/aluno/login', alunoLoginController);

  app.register(async (privateScope) => {
    privateScope.addHook('onRequest', alunoAuthGuard);
    privateScope.get('/aluno/me', alunoMeController);
  });
}
