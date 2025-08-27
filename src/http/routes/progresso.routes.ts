import type { FastifyInstance } from 'fastify';
import { getCursoProgressoController } from '../controllers/progresso/get-curso-progresso.js';
import { updateVideoAulaProgressoController } from '../controllers/progresso/update-videoaula-progresso.js';

export async function progressoRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (req) => { await req.jwtVerify(); });

  app.get('/me/cursos/:cursoId/progresso', getCursoProgressoController);
  app.patch('/me/cursos/:cursoId/progresso', updateVideoAulaProgressoController);
}
