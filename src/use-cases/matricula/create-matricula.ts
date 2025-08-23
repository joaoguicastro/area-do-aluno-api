import type { MatriculasRepository, CreateMatriculaInput } from '../../repositories/matriculas-repository.js';
import type { AlunosRepository } from '../../repositories/alunos-repository.js';
import type { CursosRepository } from '../../repositories/cursos-repository.js';
import type { TurmasRepository } from '../../repositories/turmas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class CreateMatriculaUseCase {
  constructor(
    private matriculasRepo: MatriculasRepository,
    private alunosRepo: AlunosRepository,
    private cursosRepo: CursosRepository,
    private turmasRepo: TurmasRepository
  ) {}

  async execute(input: CreateMatriculaInput) {
    const aluno = await this.alunosRepo.findById(input.alunoId);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);

    const curso = await this.cursosRepo.findById(input.cursoId);
    if (!curso) throw new AppError('Curso não encontrado', 404);

    if (input.turmaId != null) {
      const turma = await this.turmasRepo.findById(input.turmaId);
      if (!turma) throw new AppError('Turma não encontrada', 404);
      if (turma.cursoId !== input.cursoId) {
        throw new AppError('Turma não pertence ao curso informado', 409);
      }
    }

    const active = await this.matriculasRepo.findActiveByAlunoAndCurso(input.alunoId, input.cursoId);
    if (active) throw new AppError('Já existe matrícula ATIVA para este aluno neste curso', 409);

    const matricula = await this.matriculasRepo.create({
      alunoId: input.alunoId,
      cursoId: input.cursoId,
      turmaId: input.turmaId ?? null,
      status: input.status ?? 'ATIVA',
      dataInicio: input.dataInicio ?? new Date(),
      dataFim: input.dataFim ?? null,
    });

    return { matricula };
  }
}
