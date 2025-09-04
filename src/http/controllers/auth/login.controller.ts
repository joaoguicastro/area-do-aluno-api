import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository.js';
import { AuthenticateUserUseCase } from '../../../use-cases/authenticate-user.js';
import { AuthenticateAlunoUseCase } from '../../../use-cases/authenticate-aluno.js';
import { computeFinanceLock } from '../../../use-cases/_helpers/compute-finance-lock.js';

const adminSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});
const alunoSchema = z.object({
  cpfOrMatricula: z.string().min(4),
  senha: z.string().min(6),
});
const schema = z.union([adminSchema, alunoSchema]);

export async function loginController(req: FastifyRequest, reply: FastifyReply) {
  const body = schema.parse(req.body);

  // --- ADMIN / STAFF ---
  if ('email' in body) {
    const { email, senha } = body;
    const usersRepo = new PrismaUsersRepository();
    const authAdmin = new AuthenticateUserUseCase(usersRepo);
    const { user } = await authAdmin.execute({ email, senha });

    const token = await reply.jwtSign(
      { sub: user.id, role: user.role, email: user.email },
      { expiresIn: '7d' }
    );

    return reply.send({
      token,
      role: user.role,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  }

  // --- ALUNO ---
  const { cpfOrMatricula, senha } = body;
  const authAluno = new AuthenticateAlunoUseCase();
  const { aluno } = await authAluno.execute({ cpfOrMatricula, senha });

  // calcula lock real
  const financeLock = await computeFinanceLock(aluno.id);

  const token = await reply.jwtSign(
    { sub: aluno.id, role: 'aluno' }, // role minúscula OK, o front já normaliza
    { expiresIn: '7d' }
  );

  return reply.send({
    token,
    role: 'aluno',
    aluno: {
      id: aluno.id,
      nome: aluno.nome,
      matricula: aluno.matricula,
    },
    financeLock, // -> agora vem preenchido corretamente
  });
}
