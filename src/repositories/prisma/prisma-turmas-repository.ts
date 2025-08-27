import { prisma } from '../../core/prisma.js';
import type {
  TurmasRepository,
  Turma,
  TurmaHorario,
  CreateTurmaInput,
  UpdateTurmaInput,
  CreateHorarioInput,
  ListTurmasParams,
} from '../turmas-repository.js';
import type { Prisma } from '@prisma/client';

export class PrismaTurmasRepository implements TurmasRepository {
  async create(data: CreateTurmaInput): Promise<Turma> {
    const r = await prisma.turma.create({
      data: {
        cursoId: data.cursoId,
        nome: data.nome ?? null,
        capacidade: data.capacidade ?? null,
      },
    });
    return this.mapTurma(r);
  }

  async findById(id: string): Promise<Turma | null> {
    const r = await prisma.turma.findUnique({ where: { id } });
    return r ? this.mapTurma(r) : null;
  }

  async findByIdCurso(cursoId: string): Promise<Turma | null> {
    const r = await prisma.turma.findFirst({ where: { cursoId } });
    return r ? this.mapTurma(r) : null;
  }

  async list(params: ListTurmasParams): Promise<{ data: Turma[]; total: number }> {
    const { cursoId, q, page = 1, perPage = 10 } = params ?? {};
    const where: Prisma.TurmaWhereInput = {};

    if (cursoId) where.cursoId = cursoId;
    if (q) where.nome = { contains: q, mode: 'insensitive' };

    const [rows, total] = await Promise.all([
      prisma.turma.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.turma.count({ where }),
    ]);

    return { data: rows.map(this.mapTurma), total };
  }

  async update(id: string, data: UpdateTurmaInput): Promise<Turma> {
    const updateData: Prisma.TurmaUpdateInput = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.capacidade !== undefined) updateData.capacidade = data.capacidade;

    const r = await prisma.turma.update({ where: { id }, data: updateData });
    return this.mapTurma(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.turma.delete({ where: { id } });
  }

  async addHorario(turmaId: string, data: CreateHorarioInput): Promise<TurmaHorario> {
    const r = await prisma.turmaHorario.create({
      data: {
        turmaId,
        diaSemana: data.diaSemana,
        inicio: data.inicio,
        fim: data.fim,
      },
    });
    return this.mapHorario(r);
  }

  async listHorarios(turmaId: string): Promise<TurmaHorario[]> {
    const rows = await prisma.turmaHorario.findMany({
      where: { turmaId },
      orderBy: [{ diaSemana: 'asc' }, { inicio: 'asc' }],
    });
    return rows.map(this.mapHorario);
  }

  async removeHorario(horarioId: string): Promise<void> {
    await prisma.turmaHorario.delete({ where: { id: horarioId } });
  }

  private mapTurma = (r: any): Turma => ({
    id: r.id,
    cursoId: r.cursoId,
    nome: r.nome,
    capacidade: r.capacidade,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  });

  private mapHorario = (r: any): TurmaHorario => ({
    id: r.id,
    turmaId: r.turmaId,
    diaSemana: r.diaSemana,
    inicio: r.inicio,
    fim: r.fim,
  });
}
