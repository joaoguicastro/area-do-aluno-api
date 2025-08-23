import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { UpdateAlunoUseCase } from '../../../use-cases/aluno/update-aluno.js';
import type { UpdateAlunoInput } from '../../../repositories/alunos-repository.js';

export async function updateAlunoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({
    nome: z.string().min(2).optional(),
    telefone: z.string().optional(),
    email: z.string().email().optional(),
    fotoUrl: z.string().url().optional(),
    rua: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
  });

  const { id } = paramsSchema.parse(req.params);
  const data = bodySchema.parse(req.body);

  const payload: UpdateAlunoInput = {};
  if (data.nome !== undefined) payload.nome = data.nome;
  if (data.telefone !== undefined) payload.telefone = data.telefone;
  if (data.email !== undefined) payload.email = data.email;
  if (data.fotoUrl !== undefined) payload.fotoUrl = data.fotoUrl;
  if (data.rua !== undefined) payload.rua = data.rua;
  if (data.numero !== undefined) payload.numero = data.numero;
  if (data.bairro !== undefined) payload.bairro = data.bairro;
  if (data.cidade !== undefined) payload.cidade = data.cidade;

  const repo = new PrismaAlunosRepository();
  const useCase = new UpdateAlunoUseCase(repo);

  const { aluno } = await useCase.execute(id, payload);
  return reply.send({ aluno });
}
