import { type Parcela } from '@prisma/client'
import { type ParcelasRepository } from '../../repositories/parcelas-repository.js'

export class ListParcelasByMatriculaUseCase {
  constructor(private parcelasRepo: ParcelasRepository) {}

  async execute(matriculaId: string): Promise<{ parcelas: Parcela[] }> {
    const parcelas = await this.parcelasRepo.listByMatricula(matriculaId)
    return { parcelas }
  }
}
