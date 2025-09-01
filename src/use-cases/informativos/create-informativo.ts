import type { InformativosRepository, CreateInformativoInput } from '../../repositories/informativos-repository.js';

export class CreateInformativoUseCase {
  private repo: InformativosRepository;
  constructor(repo: InformativosRepository) {
    this.repo = repo;
  }

  async execute(input: CreateInformativoInput) {
    const info = await this.repo.create(input);
    return { informativo: info };
  }
}
