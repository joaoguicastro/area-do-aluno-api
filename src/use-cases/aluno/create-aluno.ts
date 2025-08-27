import { hash } from 'bcryptjs';
import type { AlunosRepository, CreateAlunoInput } from '../../repositories/alunos-repository.js';
import { PrismaAlunoAcessoRepository } from '../../repositories/prisma/prisma-aluno-acesso-repository.js';
import { gerarMatricula } from '../../utils/gerarMatricula.js';
import { normalizarCPF, cpf11 } from '../../utils/cpf.js';

interface Request {
  aluno: Omit<CreateAlunoInput, 'matricula' | 'cpfAluno'> & { cpfAluno: string };
  senhaPlano: string;          
  prefixoMatricula?: string;   
}

export class CreateAlunoUseCase {
  constructor(private alunosRepo: AlunosRepository) {}

  async execute({ aluno, senhaPlano, prefixoMatricula = 'INF' }: Request) {
    const cpfNorm = normalizarCPF(aluno.cpfAluno);
    if (!cpf11(cpfNorm)) {
      throw new Error('CPF do aluno inválido. Use 11 dígitos.');
    }

    const matricula = await gerarMatricula(prefixoMatricula);
    const senhaHash = await hash(senhaPlano, 10);

    const created = await this.alunosRepo.create({
      ...aluno,
      cpfAluno: cpfNorm,
      matricula,
    });

    const acessoRepo = new PrismaAlunoAcessoRepository();
    await acessoRepo.create({
      alunoId: created.id,
      senhaHash,
    });

    return { aluno: created };
  }
}
