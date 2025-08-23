import type { MatriculasRepository, UpdateMatriculaInput } from '../../repositories/matriculas-repository.js';
import type { TurmasRepository } from '../../repositories/turmas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class UpdateMatriculaUseCase {
  constructor(
    private matriculasRepo: MatriculasRepository,
    private turmasRepo: TurmasRepository
  ) {}

  async execute(id: string, data: UpdateMatriculaInput) {
    const current = await this.matriculasRepo.findById(id);
    if (!current) throw new AppError('Matrícula não encontrada', 404);

    if (data.turmaId !== undefined && data.turmaId !== null) {
      const turma = await this.turmasRepo.findById(data.turmaId);
      if (!turma) throw new AppError('Turma não encontrada', 404);
      if (turma.cursoId !== current.cursoId) {
        throw new AppError('Turma não pertence ao mesmo curso da matrícula', 409);
      }
    }

    if (data.dataFim !== undefined && data.status === 'ATIVA') {
      throw new AppError('dataFim não deve ser definida com status ATIVA', 400);
    }

    const payload: UpdateMatriculaInput = {};
    if (data.turmaId !== undefined) payload.turmaId = data.turmaId;
    if (data.status !== undefined) payload.status = data.status;
    if (data.dataFim !== undefined) payload.dataFim = data.dataFim;

    const matricula = await this.matriculasRepo.update(id, payload);
    return { matricula };
  }
}
