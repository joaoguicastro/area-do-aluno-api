import type { CursosRepository, CreateCursoInput } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class CreateCursoUseCase {
  constructor(private repo: CursosRepository) {}

  async execute(input: CreateCursoInput) {
    const exists = await this.repo.findByName(input.nome);
    if (exists) throw new AppError('Curso já existe com esse nome', 409);

    const curso = await this.repo.create(input);
    return { curso };
  }
}
