import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function gerarMatricula(codUnidade: string) {
  const ano = new Date().getFullYear();
  let tentativa = 0;

  while (tentativa < 50) {
    const seq = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    const matricula = `${ano}-${codUnidade}-${seq}`;

    const existente = await prisma.aluno.findUnique({ where: { matricula } });
    if (!existente) return matricula;

    tentativa++;
  }
  throw new Error('Não foi possível gerar matrícula única. Tente novamente.');
}
