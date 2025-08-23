import type { TurmasRepository, ListTurmasParams } from '../../repositories/turmas-repository.js';

export class ListTurmasUseCase {
  constructor(private turmasRepo: TurmasRepository) {}

  async execute(params: ListTurmasParams) {
    const args: ListTurmasParams = {};
    if (params.cursoId !== undefined) args.cursoId = params.cursoId;
    if (params.q !== undefined) args.q = params.q;
    if (params.page !== undefined) args.page = params.page;
    if (params.perPage !== undefined) args.perPage = params.perPage;

    const { data, total } = await this.turmasRepo.list(args);
    return { data, total, page: args.page ?? 1, perPage: args.perPage ?? 10 };
  }
}
