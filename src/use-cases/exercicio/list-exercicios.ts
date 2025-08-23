import type { ExerciciosRepository, ListExerciciosParams } from '../../repositories/exercicios-repository.js';

export class ListExerciciosUseCase {
  constructor(private repo: ExerciciosRepository) {}

  async execute(params: ListExerciciosParams) {
    const args: ListExerciciosParams = {};
    if (params.cursoId !== undefined) args.cursoId = params.cursoId;
    if (params.q !== undefined) args.q = params.q;
    if (params.publicados !== undefined) args.publicados = params.publicados;
    if (params.page !== undefined) args.page = params.page;
    if (params.perPage !== undefined) args.perPage = params.perPage;

    const { data, total } = await this.repo.list(args);
    return { data, total, page: args.page ?? 1, perPage: args.perPage ?? 10 };
  }
}
