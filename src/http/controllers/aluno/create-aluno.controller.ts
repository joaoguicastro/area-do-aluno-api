import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { CreateAlunoUseCase } from '../../../use-cases/aluno/create-aluno.js';

export async function createAlunoController(req: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    nome: z.string().min(2),
    cpfAluno: z.string().min(11),
    dataNascimentoAluno: z.coerce.date(),

    nomeResponsavel: z.string().min(2),
    cpfResponsavel: z.string().min(11),
    dataNascimentoResponsavel: z.coerce.date(),

    rua: z.string().min(1),
    numero: z.string().min(1),
    bairro: z.string().min(1),
    cidade: z.string().min(1),

    telefone: z.string().optional(),
    email: z.string().email().optional(),
    fotoUrl: z.string().url().optional(),

    senha: z.string().min(6),
    prefixoMatricula: z.string().min(2).max(6).optional(), 
  });

  const data = bodySchema.parse(req.body);

  const repo = new PrismaAlunosRepository();
  const useCase = new CreateAlunoUseCase(repo);

  const { aluno } = await useCase.execute({
    aluno: {
      nome: data.nome,
      cpfAluno: data.cpfAluno,
      dataNascimentoAluno: data.dataNascimentoAluno,

      nomeResponsavel: data.nomeResponsavel,
      cpfResponsavel: data.cpfResponsavel,
      dataNascimentoResponsavel: data.dataNascimentoResponsavel,

      rua: data.rua,
      numero: data.numero,
      bairro: data.bairro,
      cidade: data.cidade,

      telefone: data.telefone ?? null,
      email: data.email ?? null,
      fotoUrl: data.fotoUrl ?? null,

    },
    senhaPlano: data.senha,
    prefixoMatricula: data.prefixoMatricula ?? 'INF',
  });

  return reply.status(201).send({
    aluno: {
      id: aluno.id,
      nome: aluno.nome,
      cpfAluno: aluno.cpfAluno,
      matricula: aluno.matricula,  
      email: aluno.email,
    },
    message: 'Aluno criado com sucesso.',
  });
}
