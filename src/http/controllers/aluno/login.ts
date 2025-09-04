// src/http/controllers/auth/aluno-login.controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { AuthenticateAlunoUseCase } from '../../../use-cases/authenticate-aluno.js';
import { checkInadimplencia } from '../../../use-cases/financeiro/check-inadimplencia.js';

export async function alunoLoginController(req: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    // mantém o mesmo payload que você já usa (cpf/matrícula + senha ou email + senha)
    cpfOrMatricula: z.string().optional(),
    email: z.string().email().optional(),
    senha: z.string().min(6),
  });

  const { cpfOrMatricula, email, senha } = schema.parse(req.body);

  const useCase = new AuthenticateAlunoUseCase();
  const { aluno, acessoId } = await useCase.execute(
    email ? { email, senha } : { cpfOrMatricula: cpfOrMatricula!, senha }
  );

  // calcula o status financeiro REAL
  const fin = await checkInadimplencia(aluno.id);

  const token = await reply.jwtSign(
    { sub: aluno.id, role: 'aluno', acessoId },
    { expiresIn: '7d' }
  );

  return reply.send({
    token,
    role: 'aluno',
    aluno: {
      id: aluno.id,
      nome: aluno.nome,
      email: aluno.email ?? undefined,
      matricula: aluno.matricula ?? undefined,
    },
    // agora vem preenchido de verdade
    financeLock: {
      active: fin.requireFinance,         // <- TRUE quando deve bloquear
      limite: fin.diasMaxAtraso,          // ex: 5 dias (ou o que sua regra usar)
      maiorAtraso: fin.maiorAtrasoDias,   // maior atraso encontrado
      vencidas: fin.vencidas,             // qnt de parcelas vencidas
      totalVencido: fin.totalVencido,     // somatório R$
    },
  });
}
