import { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Input = { cpfOrMatricula: string; senha: string };
type Output = {
  aluno: { id: string; nome: string; email?: string | null; matricula: string };
  acessoId: string;
};

function normalizarCPF(cpf: string) {
  return (cpf || '').replace(/\D/g, '');
}

export class AuthenticateAlunoUseCase {
  async execute({ cpfOrMatricula, senha }: Input): Promise<Output> {
    const talvezCpf = normalizarCPF(cpfOrMatricula);
    const ehCpf = /^\d{11}$/.test(talvezCpf);

    const aluno = await prisma.aluno.findFirst({
      where: ehCpf ? { cpfAluno: talvezCpf } : { matricula: cpfOrMatricula },
      include: { acesso: true },
    });

    if (!aluno || !aluno.acesso || !aluno.acesso.isActive) {
      throw new Error('Credenciais inválidas.');
    }

    const ok = await compare(senha, aluno.acesso.senhaHash);
    if (!ok) throw new Error('Credenciais inválidas.');

    await prisma.alunoAcesso.update({
      where: { id: aluno.acesso.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      acessoId: aluno.acesso.id,
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email ?? null,
        matricula: aluno.matricula,
      },
    };
  }
}
