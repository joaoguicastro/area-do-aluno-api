import { type Financeiro } from '@prisma/client'
import { type FinanceirosRepository, type UpsertFinanceiroInput } from '../../repositories/financeiros-repository.js'

export class UpsertFinanceiroCursoUseCase {
  constructor(private financeirosRepo: FinanceirosRepository) {}

  async execute(input: UpsertFinanceiroInput): Promise<{ financeiro: Financeiro }> {
    const financeiro = await this.financeirosRepo.upsertForCurso(input)
    return { financeiro }
  }
}
