import type { CursosRepository } from '../../repositories/cursos-repository.js';

interface ListInput {
  q?: string;
  page?: number;
  perPage?: number;
}

export class ListCursosUseCase {
  constructor(private repo: CursosRepository) {}

  async execute({ q, page = 1, perPage = 10 }: ListInput) {
    const args: { q?: string; page?: number; perPage?: number } = { page, perPage };
    if (q !== undefined) {
      args.q = q;
    }

    const { data, total } = await this.repo.list(args);
    return { data, total, page, perPage };
  }
}
