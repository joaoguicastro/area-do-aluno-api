import { prisma } from '../../core/prisma.js';
import type {
  AlunosRepository,
  Aluno,
  CreateAlunoInput,
  UpdateAlunoInput,
  ListAlunosParams,
} from '../alunos-repository.js';
import type { Prisma } from '@prisma/client';

export class PrismaAlunosRepository implements AlunosRepository {
  async create(data: CreateAlunoInput): Promise<Aluno> {
    const r = await prisma.aluno.create({
      data: {
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

        matricula: data.matricula,
      },
    });
    return this.map(r);
  }

  async findById(id: string): Promise<Aluno | null> {
    const r = await prisma.aluno.findUnique({ where: { id } });
    return r ? this.map(r) : null;
  }

  async findByCPF(cpf: string): Promise<Aluno | null> {
    const r = await prisma.aluno.findUnique({ where: { cpfAluno: cpf } });
    return r ? this.map(r) : null;
  }

  async list(params: ListAlunosParams): Promise<{ data: Aluno[]; total: number }> {
    const { q, page = 1, perPage = 10 } = params ?? {};
    const where: Prisma.AlunoWhereInput = {};
    if (q) {
      where.OR = [
        { nome: { contains: q, mode: 'insensitive' } },
        { cpfAluno: { contains: q } },
        { email: { contains: q, mode: 'insensitive' } },
        { cidade: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.aluno.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.aluno.count({ where }),
    ]);

    return { data: rows.map(this.map), total };
  }

  async update(id: string, data: UpdateAlunoInput): Promise<Aluno> {
    const updateData: Prisma.AlunoUpdateInput = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.fotoUrl !== undefined) updateData.fotoUrl = data.fotoUrl;
    if (data.rua !== undefined) updateData.rua = data.rua;
    if (data.numero !== undefined) updateData.numero = data.numero;
    if (data.bairro !== undefined) updateData.bairro = data.bairro;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;

    const r = await prisma.aluno.update({ where: { id }, data: updateData });
    return this.map(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.aluno.delete({ where: { id } });
  }

  private map = (r: any): Aluno => ({
    id: r.id,
    nome: r.nome,
    cpfAluno: r.cpfAluno,
    dataNascimentoAluno: r.dataNascimentoAluno,
    nomeResponsavel: r.nomeResponsavel,
    cpfResponsavel: r.cpfResponsavel,
    dataNascimentoResponsavel: r.dataNascimentoResponsavel,
    rua: r.rua,
    numero: r.numero,
    bairro: r.bairro,
    cidade: r.cidade,
    telefone: r.telefone,
    email: r.email,
    fotoUrl: r.fotoUrl,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    matricula: r.matricula,
  });
}
