import { prisma } from '../../core/prisma.js';

export async function checkInadimplencia(alunoId: string) {
  // lê config (assumindo tabela unica SistemaConfig com campo diasMaxAtraso)
  const cfg = await prisma.configuracaoSystema.findFirst();
  const diasMaxAtraso = cfg?.diasAtrasoBloqueio ?? 9999;

  const hoje = new Date();

  const parcelas = await prisma.parcela.findMany({
    where: {
      status: { not: 'PAGA' as any },
      matricula: { alunoId },
    },
    include: {
      matricula: { include: { curso: true } },
    },
    orderBy: [{ vencimento: 'asc' }],
  });

  let vencidas = 0;
  let maiorAtrasoDias = 0;
  let totalVencido = 0;

  const views = parcelas.map((p) => {
    const isVencida = p.vencimento < hoje;
    const diasAtraso = isVencida
      ? Math.max(1, Math.floor((+hoje - +p.vencimento) / 86400000))
      : 0;
    if (isVencida) {
      vencidas += 1;
      maiorAtrasoDias = Math.max(maiorAtrasoDias, diasAtraso);
      totalVencido += Number(p.valor);
    }
    return {
      id: p.id,
      matriculaId: p.matriculaId,
      cursoId: p.matricula.cursoId,
      cursoNome: p.matricula.curso.nome,
      numero: p.numero,
      valor: Number(p.valor),
      vencimento: p.vencimento,
      status: p.status,
      diasAtraso,
    };
  });

  const requireFinance = maiorAtrasoDias > diasMaxAtraso;

  return {
    requireFinance,
    diasMaxAtraso,
    maiorAtrasoDias,
    vencidas,
    totalVencido,
    parcelas: views,
  };
}
