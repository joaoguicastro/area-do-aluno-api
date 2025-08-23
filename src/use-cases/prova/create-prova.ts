import type { ProvasRepository, CreateProvaInput } from '../../repositories/provas-repository.js';
import type { CursosRepository } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class CreateProvaUseCase {
  constructor(private repo: ProvasRepository, private cursosRepo: CursosRepository) {}

  async execute(input: CreateProvaInput) {
    const curso = await this.cursosRepo.findById(input.cursoId);
    if (!curso) throw new AppError('Curso não encontrado', 404);

    const prova = await this.repo.create({
      cursoId: input.cursoId,
      titulo: input.titulo,
      descricao: input.descricao ?? null,
      inicioEm: input.inicioEm ?? null,
      fimEm: input.fimEm ?? null,
      duracaoMin: input.duracaoMin ?? null,
      publicado: input.publicado ?? false,
    });
    return { prova };
  }
}
