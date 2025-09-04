import { type Parcela } from '@prisma/client'
import { type ParcelasRepository } from '../../repositories/parcelas-repository.js'

export class EstornoParcelaUseCase {
  constructor(private parcelasRepo: ParcelasRepository) {}

  async execute(id: string): Promise<{ parcela: Parcela }> {
    const parcela = await this.parcelasRepo.estornarParcela(id)
    return { parcela }
  }
}
