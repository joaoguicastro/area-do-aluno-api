import type { InformativosRepository, ListParams, ListResult } from '../../repositories/informativos-repository.js';

export class ListInformativosDoAlunoUseCase {
  private repo: InformativosRepository;
  constructor(repo: InformativosRepository) {
    this.repo = repo;
  }

  async execute(alunoId: string, params: ListParams): Promise<ListResult> {
    const p: ListParams = { page: params.page, perPage: params.perPage };
    if (params.q !== undefined && params.q !== '') p.q = params.q;
    return this.repo.listForAluno(alunoId, p);
  }
}
