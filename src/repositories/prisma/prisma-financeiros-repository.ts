import { prisma } from '../../core/prisma.js'
import { type FinanceirosRepository, type UpsertFinanceiroInput } from '../financeiros-repository.js'
import { type Financeiro } from '@prisma/client'

export class PrismaFinanceirosRepository implements FinanceirosRepository {
  async upsertForCurso(data: UpsertFinanceiroInput): Promise<Financeiro> {
    return prisma.financeiro.upsert({
      where: { cursoId: data.cursoId }, 
      update: {
        nome: data.nome,
        valorTotal: data.valorTotal as any,
        numeroParcelas: data.numeroParcelas,
        diaVencimento: data.diaVencimento ?? null,
        jurosAoMes: data.jurosAoMes as any,
        multaPercent: data.multaPercent as any,
      },
      create: {
        cursoId: data.cursoId,
        nome: data.nome,
        valorTotal: data.valorTotal as any,
        numeroParcelas: data.numeroParcelas,
        diaVencimento: data.diaVencimento ?? null,
        jurosAoMes: data.jurosAoMes as any,
        multaPercent: data.multaPercent as any,
      },
    })
  }

  async findByCursoId(cursoId: string) {
    return prisma.financeiro.findUnique({ where: { cursoId } })
  }

  async findById(id: string) {
    return prisma.financeiro.findUnique({ where: { id } })
  }
}
