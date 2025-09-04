import { type FastifyInstance } from 'fastify'
import { upsertFinanceiroCursoController } from '../controllers/financeiro/upsert-financeiro-curso.controller.js'
import { getFinanceiroByCursoController } from '../controllers/financeiro/get-financeiro-curso.controller.js'

export async function financeiroRoutes(app: FastifyInstance) {
  app.post('/cursos/:cursoId/financeiro', upsertFinanceiroCursoController)

  app.get('/cursos/:cursoId/financeiro', getFinanceiroByCursoController)
}
