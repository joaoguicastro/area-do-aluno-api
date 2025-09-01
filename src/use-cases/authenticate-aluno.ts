import { prisma } from '../core/prisma.js';
import { AppError } from '../http/errors/app-error.js';
import { comparePassword } from '../utils/hash.js';

type Input =
  | { cpfOrMatricula: string; senha: string }
  | { email: string; senha: string }; // se você usa a outra variação em algum lugar

export class AuthenticateAlunoUseCase {
  async execute(params: Input) {
    let aluno: any = null;

    if ('email' in params) {
      const email = params.email.trim().toLowerCase();
      aluno = await prisma.aluno.findFirst({
        where: { email },
        include: { acesso: true },
      });
      if (!aluno || !aluno.acesso?.senhaHash) {
        throw new AppError('Credenciais inválidas.', 401);
      }
      const ok = await comparePassword(params.senha, aluno.acesso.senhaHash);
      if (!ok) throw new AppError('Credenciais inválidas.', 401);

      return { aluno, acessoId: aluno.acesso.id };
    }

    // FLUXO PADRÃO: cpfOrMatricula
    const raw = (params.cpfOrMatricula ?? '').trim();
    const digits = raw.replace(/\D/g, '');
    const isCpfFormato = digits.length === 11;

    // tenta CPF (normalizado) OU matrícula (upper)
    aluno = await prisma.aluno.findFirst({
      where: isCpfFormato
        ? { cpfAluno: digits }
        : { matricula: raw.toUpperCase() },
      include: { acesso: true }, // <<<<< precisa existir rel com senhaHash
    });

    if (!aluno || !aluno.acesso?.senhaHash) {
      // Se cair aqui, provavelmente não existe linha de acesso para esse aluno
      // Verifique seu CreateAlunoUseCase para garantir a criação de `acesso` com senhaHash
      throw new AppError('Credenciais inválidas.', 401);
    }

    const ok = await comparePassword(params.senha, aluno.acesso.senhaHash);
    if (!ok) throw new AppError('Credenciais inválidas.', 401);

    return { aluno, acessoId: aluno.acesso.id };
  }
}
