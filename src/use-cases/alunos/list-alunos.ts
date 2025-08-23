import type { AlunosRepository, ListAlunosParams } from '../../repositories/alunos-repository.js';

export class ListAlunosUseCase {
  constructor(private alunosRepo: AlunosRepository) {}

  async execute(params: ListAlunosParams) {
    const args: ListAlunosParams = {};
    if (params.q !== undefined) args.q = params.q;
    if (params.page !== undefined) args.page = params.page;
    if (params.perPage !== undefined) args.perPage = params.perPage;

    const { data, total } = await this.alunosRepo.list(args);
    return { data, total, page: args.page ?? 1, perPage: args.perPage ?? 10 };
  }
}
