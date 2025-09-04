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

  async createWithParcelasFromCursoFinanceiro(data: CreateMatriculaInput): Promise<Matricula> {
    const result = await prisma.$transaction(async (tx) => {
      const fin = await tx.financeiro.findUnique({
        where: { cursoId: data.cursoId },
      });
      if (!fin) {
        throw new Error('Financeiro do curso não encontrado');
      }

      const m = await tx.matricula.create({
        data: {
          alunoId: data.alunoId,
          cursoId: data.cursoId,
          turmaId: data.turmaId ?? null,
          status: (data.status ?? 'ATIVA') as any,
          dataInicio: data.dataInicio ?? new Date(),
          dataFim: data.dataFim ?? null,
          financeiroId: fin.id,
        },
      });

      const totalCents = Math.round(Number(fin.valorTotal) * 100);
      const n = fin.numeroParcelas;
      const base = Math.floor(totalCents / n);
      const resto = totalCents - base * n;

      const start = data.dataInicio ? new Date(data.dataInicio) : new Date();
      const dia = fin.diaVencimento ?? start.getDate();

      function addMonthsClamp(date: Date, months: number, day: number) {
        const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        const y = d.getUTCFullYear();
        const mth = d.getUTCMonth() + months;
        const lastDay = new Date(Date.UTC(y, mth + 1, 0)).getUTCDate();
        const finalDay = Math.min(day, lastDay);
        return new Date(Date.UTC(y, mth, finalDay, 3, 0, 0)); 
      }

      const hoje = start;
      const diaHoje = hoje.getDate();
      const monthShift0 = diaHoje <= dia ? 0 : 1;

      const itens = Array.from({ length: n }).map((_, i) => {
        const numero = i + 1;
        const cents = base + (i === n - 1 ? resto : 0);
        const vencimento = addMonthsClamp(hoje, monthShift0 + i, dia);
        return {
          matriculaId: m.id,
          numero,
          valor: (cents / 100).toFixed(2), 
          vencimento,
        };
      });

      await tx.parcela.createMany({ data: itens, skipDuplicates: true });

      return m;
    });

    return this.map(result);
  }

}
