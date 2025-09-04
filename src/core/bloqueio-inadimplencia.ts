import { prisma } from './prisma.js'

export async function isAlunoBloqueadoPorAtraso(alunoId: string, cursoId: string) {
  const cfg = await prisma.configuracaoSystema.findFirst()
  const limite = cfg?.diasAtrasoBloqueio ?? 0
  if (limite <= 0) return { bloqueado: false, diasMaxAtraso: 0, limite }

  const matricula = await prisma.matricula.findFirst({
    where: { alunoId, cursoId, status: 'ATIVA' as any },
    select: { id: true },
  })
  if (!matricula) return { bloqueado: false, diasMaxAtraso: 0, limite }

  const now = new Date()
  const parcelasAtrasadas = await prisma.parcela.findMany({
    where: {
      matriculaId: matricula.id,
      status: 'ABERTA',
      vencimento: { lt: now },
    },
    select: { vencimento: true },
  })

  let maxDias = 0
  for (const p of parcelasAtrasadas) {
    const dias = Math.floor((now.getTime() - p.vencimento.getTime()) / 86_400_000) // 86400s
    if (dias > maxDias) maxDias = dias
  }

  const bloqueado = maxDias > limite // “mais de X dias”
  return { bloqueado, diasMaxAtraso: maxDias, limite }
}
