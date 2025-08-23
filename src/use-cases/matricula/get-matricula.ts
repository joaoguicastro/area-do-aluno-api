import type { MatriculasRepository } from '../../repositories/matriculas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class GetMatriculaUseCase {
  constructor(private matriculasRepo: MatriculasRepository) {}

  async execute(id: string) {
    const m = await this.matriculasRepo.findById(id);
    if (!m) throw new AppError('Matrícula não encontrada', 404);
    return { matricula: m };
  }
}
