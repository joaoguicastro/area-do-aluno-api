import type { MatriculasRepository, ListMatriculasParams } from '../../repositories/matriculas-repository.js';

export class ListMatriculasUseCase {
  constructor(private matriculasRepo: MatriculasRepository) {}

  async execute(params: ListMatriculasParams) {
    const args: ListMatriculasParams = {};
    if (params.alunoId !== undefined) args.alunoId = params.alunoId;
    if (params.cursoId !== undefined) args.cursoId = params.cursoId;
    if (params.turmaId !== undefined) args.turmaId = params.turmaId;
    if (params.status !== undefined) args.status = params.status;
    if (params.page !== undefined) args.page = params.page;
    if (params.perPage !== undefined) args.perPage = params.perPage;

    const { data, total } = await this.matriculasRepo.list(args);
    return { data, total, page: args.page ?? 1, perPage: args.perPage ?? 10 };
  }
}
