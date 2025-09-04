import { Prisma, type Financeiro } from '@prisma/client'

export interface UpsertFinanceiroInput {
  cursoId: string
  nome: string
  valorTotal: Prisma.Decimal | number | string
  numeroParcelas: number
  diaVencimento?: number | null
  jurosAoMes?: Prisma.Decimal | number | string | null
  multaPercent?: Prisma.Decimal | number | string | null
}

export interface FinanceirosRepository {
  upsertForCurso(data: UpsertFinanceiroInput): Promise<Financeiro>
  findByCursoId(cursoId: string): Promise<Financeiro | null>
  findById(id: string): Promise<Financeiro | null>
}
