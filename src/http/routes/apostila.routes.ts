import { FastifyInstance } from "fastify";
import { createApostilaController } from "../controllers/apostila/create-apostila.controller.js";
import { listApostilasController } from "../controllers/apostila/list-apostila.controller.js";
import { getCursoController } from "../controllers/apostila/get-apostila.controller.js";
import { deleteApostilaController } from "../controllers/apostila/delete-apostila.controller.js";
import { ensureAuth } from "../middleware/ensure-auth.js";

export async function apostilaRoutes(app: FastifyInstance) {
    app.post('/apostilas', createApostilaController);
    app.get('/cursos/:cursoId/apostilas', listApostilasController);
    app.get('/apostilas/:id', { preHandler: [ensureAuth] }, getCursoController);
    app.delete('/apostilas/:id', { preHandler: [ensureAuth] }, deleteApostilaController);
}