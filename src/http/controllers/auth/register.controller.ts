import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository.js';
import { RegisterUserUseCase } from '../../../use-cases/register-user.js';

export async function registerController(req: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    senha: z.string().min(6),
    role: z.enum(['MASTER', 'ADMIN', 'OPERADOR', 'PROFESSOR']).default('ADMIN'),
  });

  const data = schema.parse(req.body);

  const usersRepo = new PrismaUsersRepository();
  const useCase = new RegisterUserUseCase(usersRepo);

  const { user } = await useCase.execute(data);

  return reply.status(201).send({
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });

  
}
