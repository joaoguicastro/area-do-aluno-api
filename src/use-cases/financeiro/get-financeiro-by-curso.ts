import { type Financeiro } from '@prisma/client'
import { type FinanceirosRepository } from '../../repositories/financeiros-repository.js'

export class GetFinanceiroByCursoUseCase {
  constructor(private financeirosRepo: FinanceirosRepository) {}

  async execute(cursoId: string): Promise<{ financeiro: Financeiro | null }> {
    const financeiro = await this.financeirosRepo.findByCursoId(cursoId)
    return { financeiro }
  }
}
