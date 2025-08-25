import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function alunoMeController(req: FastifyRequest, reply: FastifyReply) {
  const jwt = req.user as { sub: string; role: string; };
  const alunoId = jwt.sub;

  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    select: {
      id: true,
      nome: true,
      email: true,
    },
  });

  if (!aluno) return reply.status(404).send({ message: 'Aluno não encontrado.' });

  return reply.send({ aluno });
}
