import type { TurmasRepository, CreateTurmaInput } from '../../repositories/turmas-repository.js';
import type { CursosRepository } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class CreateTurmaUseCase {
  constructor(private turmasRepo: TurmasRepository, private cursosRepo: CursosRepository) {}

  async execute(input: CreateTurmaInput) {
    const curso = await this.cursosRepo.findById(input.cursoId);
    if (!curso) throw new AppError('Curso não encontrado', 404);

    const turma = await this.turmasRepo.create({
      cursoId: input.cursoId,
      nome: input.nome ?? null,
      capacidade: input.capacidade ?? null,
    });

    return { turma };
  }
}
