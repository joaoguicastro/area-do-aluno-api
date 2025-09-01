import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../../core/prisma.js'; // ajuste o caminho se necessário

type Role = 'MASTER' | 'ADMIN' | 'OPERADOR' | 'PROFESSOR' | 'aluno';
type JwtUser = { sub: string; role: Role };

export async function meController(req: FastifyRequest, reply: FastifyReply) {
  const user = req.user as JwtUser | undefined;
  if (!user) {
    return reply.status(401).send({ message: 'Não autenticado' });
  }

  // === ALUNO ===
  if (user.role === 'aluno') {
    const alunoId = String(user.sub);

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      select: {
        id: true,
        nome: true,
        // seu modelo usa esses nomes:
        cpfAluno: true,
        matricula: true,
        dataNascimentoAluno: true,
        // adicione outros campos que quiser expor:
        // email: true, // se existir no seu modelo
      },
    });

    // pode não existir se o registro foi removido
    const payload = {
      id: aluno?.id ?? alunoId,            // id "do usuário" (aluno)
      nome: aluno?.nome ?? 'Aluno',
      email: null as string | null,        // ajuste para um campo real se tiver no modelo
      role: 'aluno' as const,
      alunoId: aluno?.id ?? alunoId,
      aluno: aluno
        ? {
            id: aluno.id,
            nome: aluno.nome,
            // campo derivado para o front
            cpfOrMatricula: aluno.matricula || aluno.cpfAluno || null,
            // também envio os originais (útil no admin, se quiser usar):
            cpfAluno: aluno.cpfAluno,
            matricula: aluno.matricula,
            // converte para YYYY-MM-DD para evitar timezone bug
            dataNascimento: aluno.dataNascimentoAluno
              ? aluno.dataNascimentoAluno.toISOString().slice(0, 10)
              : null,
          }
        : null,
    };

    return reply.send({ data: payload });
  }

  // === FUNCIONÁRIO / ADMIN / MASTER / PROFESSOR / OPERADOR ===
  const funcionarioId = String(user.sub);

  const funcionario = await prisma.funcionario.findUnique({
    where: { id: funcionarioId },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
    },
  });

  const payload = {
    id: funcionario?.id ?? funcionarioId,
    nome: funcionario?.nome ?? 'Usuário',
    email: funcionario?.email ?? null,
    role: (funcionario?.role ?? user.role) as Role,
    alunoId: null as null,
    aluno: null as null,
  };

  return reply.send({ data: payload });
}
