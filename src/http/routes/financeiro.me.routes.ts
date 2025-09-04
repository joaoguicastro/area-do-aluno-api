import type { FastifyInstance } from 'fastify';
import { ensureAluno } from '../middleware/ensure-aluno.js';
import {
  getFinanceGateController,
  listMinhasParcelasController,
} from '../controllers/financeiro/me-financeiro.controllers.js';

export async function meFinanceiroRoutes(app: FastifyInstance) {
  app.get(
    '/me/financeiro/gate',
    { preHandler: [app.authenticate, ensureAluno] },
    getFinanceGateController
  );

  app.get(
    '/me/financeiro/parcelas',
    { preHandler: [app.authenticate, ensureAluno] },
    listMinhasParcelasController
  );
}
