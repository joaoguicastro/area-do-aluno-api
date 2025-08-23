import type { TurmasRepository, CreateHorarioInput } from '../../repositories/turmas-repository.js';
import type { CursosRepository } from '../../repositories/cursos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

function isValidHHmm(v: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
}

export class AddHorarioUseCase {
  constructor(private turmasRepo: TurmasRepository, private cursosRepo: CursosRepository) {}

  async execute(turmaId: string, input: CreateHorarioInput) {
    const turma = await this.turmasRepo.findById(turmaId);
    if (!turma) throw new AppError('Turma não encontrada', 404);

    const curso = await this.cursosRepo.findById(turma.cursoId);
    if (!curso) throw new AppError('Curso não encontrado', 404);

    if (curso.modality !== 'PRESENCIAL') {
      throw new AppError('Somente cursos PRESENCIAIS podem ter horários de turma', 409);
    }

    if (input.diaSemana < 0 || input.diaSemana > 6) {
      throw new AppError('diaSemana deve estar entre 0 e 6', 400);
    }

    if (!isValidHHmm(input.inicio) || !isValidHHmm(input.fim)) {
      throw new AppError('Horário inválido. Use formato HH:mm', 400);
    }

    if (input.inicio >= input.fim) {
      throw new AppError('Horário inválido: início deve ser menor que fim', 400);
    }

    const existentes = await this.turmasRepo.listHorarios(turmaId);
    for (const h of existentes) {
      if (h.diaSemana !== input.diaSemana) continue;
      const overlap = !(input.fim <= h.inicio || input.inicio >= h.fim);
      if (overlap) {
        throw new AppError('Conflito de horário com outro registro deste dia', 409);
      }
    }

    const horario = await this.turmasRepo.addHorario(turmaId, input);
    return { horario };
  }
}
