import { PrismaClient } from '@prisma/client';
import { AlunoAcessoRepository, CreateAlunoAcessoInput } from '../aluno-acesso-repository.js';

const prisma = new PrismaClient();

export class PrismaAlunoAcessoRepository implements AlunoAcessoRepository {
  async create(data: CreateAlunoAcessoInput): Promise<void> {
    await prisma.alunoAcesso.create({ data });
  }
}
