import { prisma } from '../../core/prisma.js'
import { type ParcelasRepository } from '../parcelas-repository.js'
import { type FormaPagamento } from '@prisma/client'

export class PrismaParcelasRepository implements ParcelasRepository {
  async bulkCreate(items: Array<{ matriculaId: string; numero: number; valor: any; vencimento: Date }>) {
    if (!items.length) return
    await prisma.parcela.createMany({ data: items, skipDuplicates: true })
  }

  async listByMatricula(matriculaId: string) {
    return prisma.parcela.findMany({
      where: { matriculaId },
      orderBy: [{ numero: 'asc' }],
    })
  }

  async baixaParcela(id: string, payload: { formaPagamento: FormaPagamento; valorPago: any; pagoEm?: Date }) {
    return prisma.parcela.update({
      where: { id },
      data: {
        status: 'PAGA',
        formaPagamento: payload.formaPagamento,
        valorPago: payload.valorPago,
        pagoEm: payload.pagoEm ?? new Date(),
      },
    })
  }

  async estornarParcela(id: string) {
    return prisma.parcela.update({
      where: { id },
      data: { status: 'ABERTA', formaPagamento: null, valorPago: null, pagoEm: null },
    })
  }
}
