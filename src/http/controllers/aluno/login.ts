import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { AuthenticateAlunoUseCase } from '../../../use-cases/authenticate-aluno.js';

export async function alunoLoginController(req: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    email: z.string().email(),
    senha: z.string().min(6),
  });

  const { email, senha } = schema.parse(req.body);

  const useCase = new AuthenticateAlunoUseCase();
  const { aluno, acessoId } = await useCase.execute({ email, senha });

  const token = await reply.jwtSign(
    { sub: aluno.id, role: 'aluno', acessoId },
    { expiresIn: '7d' }
  );

  return reply.send({
    token,
    aluno: {
      id: aluno.id,      
      nome: aluno.nome,
      email: aluno.email ?? undefined,
    },
    role: 'aluno',
  });
}
