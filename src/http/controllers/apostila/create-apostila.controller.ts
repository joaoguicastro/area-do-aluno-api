// import { FastifyReply, FastifyRequest } from 'fastify';
// import { z } from 'zod';
// import { PrismaApostilaRepository } from '../../../repositories/prisma/prisma-apostila-repository.js';
// import { AddApostilaUseCase } from '../../../use-cases/apostila/add-apostila.js';

// export async function createApostilaController(req: FastifyRequest, reply: FastifyReply) {
//   const bodySchema = z.object({
//     titulo: z.string(),
//     cursoId: z.string(),
//     urlPDF: z.string(),
//   });

  
//     const data = bodySchema.parse(req.body);
//     const repo = new PrismaApostilaRepository();
//     const useCase = new AddApostilaUseCase(repo, repo);
//     const apostila = await useCase.execute({
//         titulo: data.titulo,
//         cursoId: data.cursoId,
//         urlPDF: data.urlPDF,
//     });
//     return reply.status(201).send({ apostila });
// }