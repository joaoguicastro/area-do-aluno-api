import type { ProvasRepository, ListProvasParams } from '../../repositories/provas-repository.js';

export class ListProvasUseCase {
  constructor(private repo: ProvasRepository) {}

  async execute(params: ListProvasParams) {
    const args: ListProvasParams = {};
    if (params.cursoId !== undefined) args.cursoId = params.cursoId;
    if (params.publicados !== undefined) args.publicados = params.publicados;
    if (params.page !== undefined) args.page = params.page;
    if (params.perPage !== undefined) args.perPage = params.perPage;
    const { data, total } = await this.repo.list(args);
    return { data, total, page: args.page ?? 1, perPage: args.perPage ?? 10 };
  }
}
