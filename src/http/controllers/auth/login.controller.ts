import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository.js';
import { AuthenticateUserUseCase } from '../../../use-cases/authenticate-user.js';

export async function loginController(req: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    email: z.string().email(),
    senha: z.string().min(6),
  });

  const { email, senha } = schema.parse(req.body);

  const usersRepo = new PrismaUsersRepository();
  const useCase = new AuthenticateUserUseCase(usersRepo);

  const { user } = await useCase.execute({ email, senha });

  const token = await reply.jwtSign(
    { sub: user.id, role: user.role, email: user.email },
    { expiresIn: '7d' }
  );

  return reply.send({ token, user: { id: user.id, nome: user.nome, role: user.role } });
}
