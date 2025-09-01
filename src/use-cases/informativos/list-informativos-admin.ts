import type { InformativosRepository, ListParams, ListResult } from '../../repositories/informativos-repository.js';

export class ListInformativosAdminUseCase {
  private repo: InformativosRepository;
  constructor(repo: InformativosRepository) {
    this.repo = repo;
  }

  async execute(params: ListParams): Promise<ListResult> {
    const p: ListParams = { page: params.page, perPage: params.perPage };
    if (params.q !== undefined && params.q !== '') p.q = params.q;
    return this.repo.list(p);
  }
}
