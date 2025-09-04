import { type FastifyInstance } from 'fastify'
import { listParcelasByMatriculaController } from '../controllers/parcelas/list-parcelas-by-matricula.controller.js'
import { baixaParcelaController } from '../controllers/parcelas/baixa-parcela.controller.js'
import { estornoParcelaController } from '../controllers/parcelas/estorno-parcela.controller.js'

export async function parcelasRoutes(app: FastifyInstance) {
  app.get('/matriculas/:matriculaId/parcelas', listParcelasByMatriculaController)

  app.patch('/parcelas/:id/baixa', baixaParcelaController)

  app.patch('/parcelas/:id/estorno', estornoParcelaController)
}
