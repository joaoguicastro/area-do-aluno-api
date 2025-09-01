import type { CursosRepository, CreateVideoAulaInput } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class AddVideoAulaUseCase {
  constructor(private repo: CursosRepository) {}

  async execute(cursoId: string, input: CreateVideoAulaInput) {
    const curso = await this.repo.findById(cursoId);
    if (!curso) throw new AppError('Curso não encontrado', 404);

    if (curso.modality !== 'ONLINE') {
      throw new AppError('Vídeo-aulas só podem ser adicionadas a cursos ONLINE', 409);
    }

    if (input.ordem == null) {
      const existentes = await this.repo.listVideoAulas(cursoId);
      const max = existentes.reduce((m, v) => (v.ordem != null && v.ordem > m ? v.ordem : m), 0);
      input.ordem = max + 1;
    }

    const video = await this.repo.addVideoAula(cursoId, input);
    return { video };
  }
}
