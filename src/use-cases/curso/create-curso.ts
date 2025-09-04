import type { CursosRepository, CreateCursoInput, CreateFinanceiroForCursoInput, FinanceiroDTO, Curso } from '../../repositories/cursos-repository.js'

export class CreateCursoUseCase {
  constructor(private cursosRepo: CursosRepository) {}

  async execute(input: CreateCursoInput & { financeiro?: CreateFinanceiroForCursoInput }):
    Promise<{ curso: Curso; financeiro?: FinanceiroDTO }> {

    if (input.financeiro) {
      const { financeiro, ...cursoData } = input as Required<typeof input>;
      return this.cursosRepo.createWithFinanceiro(cursoData, financeiro);
    }

    const curso = await this.cursosRepo.create(input);
    return { curso };
  }
}
