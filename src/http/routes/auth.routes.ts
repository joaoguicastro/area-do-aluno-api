import { FastifyInstance } from 'fastify';
import { ensureAuth } from '../middleware/ensure-auth.js';
import { registerController } from '../controllers/auth/register.controller.js';
import { loginController } from '../controllers/auth/login.controller.js';
import { meController } from '../controllers/auth/me.controller.js';
import { listUsersController } from '../controllers/auth/list-users.controller.js';
import { deleteUserController } from '../controllers/auth/delete-user.controller.js';
import { updateUserController } from '../controllers/auth/update-user.controller.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', registerController);
  app.post('/auth/login', loginController);
  app.get('/me', { preHandler: [ensureAuth] }, meController);

  app.get('/auth/funcionarios', listUsersController);
  app.delete('/auth/funcionarios/:id', deleteUserController);
  app.put('/auth/funcionarios/:id', updateUserController);
}
