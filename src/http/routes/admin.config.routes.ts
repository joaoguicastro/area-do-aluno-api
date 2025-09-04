import { type FastifyInstance } from 'fastify'
import { getSistemaConfigController } from '../controllers/config/get-config.controller.js'
import { updateSistemaConfigController } from '../controllers/config/update-config.controller.js'

export async function adminConfigRoutes(app: FastifyInstance) {
  app.addHook('preHandler', (app as any).authenticate)
  
  app.get('/admin/config/financeiro', getSistemaConfigController)
  app.patch('/admin/config/financeiro', updateSistemaConfigController)
}
