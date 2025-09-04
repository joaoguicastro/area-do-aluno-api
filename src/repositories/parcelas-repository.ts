import { type Parcela, type FormaPagamento, Prisma } from '@prisma/client'

export interface ParcelasRepository {
  bulkCreate(items: Array<{
    matriculaId: string
    numero: number
    valor: Prisma.Decimal | number | string
    vencimento: Date
  }>): Promise<void>

  listByMatricula(matriculaId: string): Promise<Parcela[]>

  baixaParcela(id: string, payload: {
    formaPagamento: FormaPagamento
    valorPago: Prisma.Decimal | number | string
    pagoEm?: Date
  }): Promise<Parcela>

  estornarParcela(id: string): Promise<Parcela>
}
