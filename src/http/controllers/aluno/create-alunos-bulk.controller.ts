import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaAlunosRepository } from '../../../repositories/prisma/prisma-alunos-repository.js';
import { CreateAlunoUseCase } from '../../../use-cases/aluno/create-aluno.js';

const alunoSchema = z.object({
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

// 👉 este controller **só** aceita array
const entradaSchema = z.array(alunoSchema).min(1);

export async function createAlunosBulkController(req: FastifyRequest, reply: FastifyReply) {
  const items = entradaSchema.parse(req.body);

  const repo = new PrismaAlunosRepository();
  const useCase = new CreateAlunoUseCase(repo);

  type ResultItem = {
    index: number;
    status: 'created' | 'error';
    aluno?: { id: string; nome: string; cpfAluno: string; matricula: string; email: string | null };
    error?: string;
  };

  const results: ResultItem[] = [];

  // sequencial para facilitar logs e evitar colisões/lock em massa
  for (let i = 0; i < items.length; i++) {
    const data = items[i];
    try {
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

      results.push({
        index: i,
        status: 'created',
        aluno: {
          id: aluno.id,
          nome: aluno.nome,
          cpfAluno: aluno.cpfAluno,
          matricula: aluno.matricula,
          email: aluno.email || null,
        },
      });
    } catch (e: any) {
      const msg =
        e?.message ||
        e?.cause?.message ||
        (e?.meta?.target ? `Violação de constraint: ${String(e.meta.target)}` : '') ||
        'Falha ao criar aluno';
      results.push({ index: i, status: 'error', error: String(msg) });
    }
  }

  const total = results.length;
  const created = results.filter(r => r.status === 'created').length;
  const failed = total - created;

  const status =
    created === 0 ? 400 :
    created === total ? 201 :
    207; // Multi-Status (parcial)

  return reply.status(status).send({
    summary: { total, created, failed },
    results,
  });
}
