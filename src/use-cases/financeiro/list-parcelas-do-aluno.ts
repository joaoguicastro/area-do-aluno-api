import { prisma } from '../../core/prisma.js';

type ParcelaRow = {
  id: string;
  matriculaId: string;
  cursoId: string | null;
  cursoNome: string;
  numero: number;
  valor: number;
  vencimento: Date | null;
  status: string | null;
  pagoEm: Date | null;
  valorPago: number | null;
  diasAtraso: number;
  pago: boolean;
};

export async function listParcelasDoAluno(alunoId: string) {
  const parcelas = await prisma.parcela.findMany({
    where: { matricula: { alunoId } }, // via relação Matricula -> Aluno
    select: {
      id: true,
      matriculaId: true,
      numero: true,
      valor: true,
      vencimento: true,
      status: true,
      formaPagamento: true, // se quiser usar depois
      pagoEm: true,
      valorPago: true,
      createdAt: true,
      updatedAt: true,
      // << pegue curso via MATRICULA
      matricula: {
        select: {
          cursoId: true,
          curso: { select: { nome: true } },
        },
      },
    },
    orderBy: [{ vencimento: 'asc' }, { numero: 'asc' }],
  });

  const hoje = new Date();
  const hojeYMD = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime();

  const rows: ParcelaRow[] = parcelas.map((p) => {
    const statusStr = String(p.status ?? '').toUpperCase();
    // considera paga se tiver pagoEm ou status começar com "PAG" (cobre PAGO/PAGA)
    const pago = !!p.pagoEm || statusStr.startsWith('PAG');

    const venc = p.vencimento ? new Date(p.vencimento) : null;
    const vencYMD = venc ? new Date(venc.getFullYear(), venc.getMonth(), venc.getDate()).getTime() : 0;

    let diasAtraso = 0;
    if (!pago && venc && hojeYMD > vencYMD) {
      diasAtraso = Math.max(0, Math.floor((hojeYMD - vencYMD) / 86_400_000));
    }

    return {
      id: p.id,
      matriculaId: p.matriculaId,
      cursoId: p.matricula?.cursoId ?? null,
      cursoNome: p.matricula?.curso?.nome ?? '—',
      numero: Number(p.numero ?? 0),
      valor: Number(p.valor ?? 0),
      vencimento: p.vencimento ?? null,
      status: p.status ?? null,
      pagoEm: p.pagoEm ?? null,
      valorPago: p.valorPago != null ? Number(p.valorPago) : null,
      diasAtraso,
      pago,
    };
  });

  // resumo apenas das NÃO pagas
  let totalVencido = 0;
  let maiorAtrasoDias = 0;
  let vencidas = 0;

  for (const r of rows) {
    if (!r.pago && r.diasAtraso > 0) {
      vencidas += 1;
      totalVencido += r.valor;
      if (r.diasAtraso > maiorAtrasoDias) maiorAtrasoDias = r.diasAtraso;
    }
  }

  return {
    data: rows,
    resumo: {
      vencidas,
      maiorAtrasoDias,
      totalVencido,
    },
  };
}
