// src/repositories/prisma/prisma-matriculas-repository.ts
import { prisma } from '../../core/prisma.js';
import type {
  MatriculasRepository,
  Matricula,
  CreateMatriculaInput,
  UpdateMatriculaInput,
  ListMatriculasParams,
} from '../matriculas-repository.js';
import type { Prisma } from '@prisma/client';

export class PrismaMatriculasRepository implements MatriculasRepository {
  async create(data: CreateMatriculaInput): Promise<Matricula> {
    const r = await prisma.matricula.create({
      data: {
        alunoId: data.alunoId,
        cursoId: data.cursoId,
        turmaId: data.turmaId ?? null,
        status: (data.status ?? 'ATIVA') as any,
        dataInicio: data.dataInicio ?? new Date(),
        dataFim: data.dataFim ?? null,
      },
    });
    return this.map(r);
  }

  async findById(id: string): Promise<Matricula | null> {
    const r = await prisma.matricula.findUnique({ where: { id } });
    return r ? this.map(r) : null;
  }

  async list(params: ListMatriculasParams): Promise<{ data: Matricula[]; total: number }> {
    const { alunoId, cursoId, turmaId, status, page = 1, perPage = 10 } = params ?? {};
    const where: Prisma.MatriculaWhereInput = {};
    if (alunoId) where.alunoId = alunoId;
    if (cursoId) where.cursoId = cursoId;
    if (turmaId) where.turmaId = turmaId; // ok se você tem o scalar turmaId no schema
    if (status) where.status = status as any;

    const [rows, total] = await Promise.all([
      prisma.matricula.findMany({
        where,
        orderBy: { dataInicio: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.matricula.count({ where }),
    ]);

    return { data: rows.map(this.map), total };
  }

  async update(id: string, data: UpdateMatriculaInput): Promise<Matricula> {
    const updateData: Prisma.MatriculaUpdateInput = {};

    // Atualiza a relação 'turma' corretamente (connect/disconnect)
    if (data.turmaId !== undefined) {
      updateData.turma =
        data.turmaId === null
          ? { disconnect: true }
          : { connect: { id: data.turmaId } };
    }

    if (data.status !== undefined) updateData.status = data.status as any;
    if (data.dataFim !== undefined) updateData.dataFim = data.dataFim;

    const r = await prisma.matricula.update({ where: { id }, data: updateData });
    return this.map(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.matricula.delete({ where: { id } });
  }

  async findActiveByAlunoAndCurso(alunoId: string, cursoId: string): Promise<Matricula | null> {
    const r = await prisma.matricula.findFirst({
      where: { alunoId, cursoId, status: 'ATIVA' as any },
    });
    return r ? this.map(r) : null;
  }

  private map = (r: any): Matricula => ({
    id: r.id,
    alunoId: r.alunoId,
    cursoId: r.cursoId,
    turmaId: r.turmaId,
    status: r.status,
    dataInicio: r.dataInicio,
    dataFim: r.dataFim,
  });
}
