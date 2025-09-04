import { type Parcela, type FormaPagamento, Prisma } from '@prisma/client'
import { type ParcelasRepository } from '../../repositories/parcelas-repository.js'

export class BaixaParcelaUseCase {
  constructor(private parcelasRepo: ParcelasRepository) {}

  async execute(input: { id: string; formaPagamento: FormaPagamento; valorPago: Prisma.Decimal | number | string; pagoEm?: Date }): Promise<{ parcela: Parcela }> {
    const parcela = await this.parcelasRepo.baixaParcela(input.id, {
      formaPagamento: input.formaPagamento,
      valorPago: input.valorPago,
      pagoEm: input.pagoEm,
    })
    return { parcela }
  }
}
