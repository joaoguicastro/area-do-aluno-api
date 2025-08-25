import { compare } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Input = { email: string; senha: string; };
type Output = {
  aluno: { id: string; nome: string; email?: string | null; };
  acessoId: string;
};

export class AuthenticateAlunoUseCase {
  async execute({ email, senha }: Input): Promise<Output> {
    const acesso = await prisma.alunoAcesso.findUnique({
      where: { email },
      include: { aluno: true },
    });

    if (!acesso || !acesso.isActive) {
      throw new Error('Credenciais inválidas.');
    }

    const ok = await compare(senha, acesso.senhaHash);
    if (!ok) throw new Error('Credenciais inválidas.');

    await prisma.alunoAcesso.update({
      where: { id: acesso.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      acessoId: acesso.id,
      aluno: {
        id: acesso.aluno.id,
        nome: acesso.aluno.nome,
        email: acesso.aluno.email ?? null,
      },
    };
  }
}
