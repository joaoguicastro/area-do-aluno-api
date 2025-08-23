import type { ExerciciosRepository, CreateExercicioInput } from '../../repositories/exercicios-repository.js';
import type { CursosRepository } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class CreateExercicioUseCase {
  constructor(private repo: ExerciciosRepository, private cursosRepo: CursosRepository) {}

  async execute(input: CreateExercicioInput) {
    const curso = await this.cursosRepo.findById(input.cursoId);
    if (!curso) throw new AppError('Curso não encontrado', 404);

    const ex = await this.repo.create({
      cursoId: input.cursoId,
      titulo: input.titulo,
      descricao: input.descricao ?? null,
      dataEntrega: input.dataEntrega ?? null,
      publicado: input.publicado ?? false,
    });
    return { exercicio: ex };
  }
}
