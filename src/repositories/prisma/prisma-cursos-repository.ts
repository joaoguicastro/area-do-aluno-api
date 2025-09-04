import { Prisma } from '@prisma/client';
import { prisma } from '../../core/prisma.js';
import type {
  CursosRepository,
  CreateCursoInput,
  UpdateCursoInput,
  Curso,
  CreateVideoAulaInput,
  VideoAula,
  FinanceiroDTO,
  CreateFinanceiroForCursoInput,
} from '../cursos-repository.js';

export class PrismaCursosRepository implements CursosRepository {
  async create(data: CreateCursoInput): Promise<Curso> {
    const r = await prisma.curso.create({ data: {
      nome: data.nome,
      modality: data.modality as any,
      duracaoHoras: data.duracaoHoras ?? null,
    }});
    return this.mapCurso(r);
  }

  async findById(id: string): Promise<Curso | null> {
    const r = await prisma.curso.findUnique({ where: { id } });
    return r ? this.mapCurso(r) : null;
  }

  async findByName(nome: string): Promise<Curso | null> {
    const r = await prisma.curso.findFirst({ where: { nome } });
    return r ? this.mapCurso(r) : null;
  }

  async list(params: { q?: string; page?: number; perPage?: number }): Promise<{ data: Curso[]; total: number }> {
    const { q, page = 1, perPage = 10 } = params ?? {};
    const where = q
      ? { nome: { contains: q, mode: 'insensitive' as const } }
      : {};

    const [rows, total] = await Promise.all([
      prisma.curso.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.curso.count({ where }),
    ]);

    return { data: rows.map(this.mapCurso), total };
  }

  async update(id: string, data: UpdateCursoInput): Promise<Curso> {
    const updateData: Prisma.CursoUpdateInput = {};

    if (data.nome !== undefined) {
      updateData.nome = data.nome;
    }
    if (data.modality !== undefined) {
      // enum do domínio -> enum do Prisma
      updateData.modality = data.modality as any;
    }
    if (data.duracaoHoras !== undefined) {
      updateData.duracaoHoras = data.duracaoHoras;
    }

    const r = await prisma.curso.update({
      where: { id },
      data: updateData,
    });
    return this.mapCurso(r);
  }


  async delete(id: string): Promise<void> {
    await prisma.curso.delete({ where: { id } });
  }

  async addVideoAula(cursoId: string, data: CreateVideoAulaInput): Promise<VideoAula> {
    const r = await prisma.videoAula.create({
      data: {
        cursoId,
        titulo: data.titulo,
        descricao: data.descricao ?? null,
        urlVideo: data.urlVideo,
        ordem: data.ordem ?? null,
        duracaoMin: data.duracaoMin ?? null,
        moduloId: data.moduloId ?? null,
        liberarEm: data.liberarEm ?? null,
      },
    });
    return this.mapVideoAula(r);
  }

  async listVideoAulas(cursoId: string): Promise<VideoAula[]> {
    const rows = await prisma.videoAula.findMany({
      where: { cursoId },
      orderBy: [{ ordem: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map(this.mapVideoAula);
  }
  async listVideoAulasLiberadas(cursoId: string, now: Date): Promise<VideoAula[]> {
    const rows = await prisma.videoAula.findMany({
      where: {
        cursoId,
        OR: [
          { liberarEm: null },
          { liberarEm: { lte: now } },           
        ],
      },
      orderBy: [{ ordem: 'asc' }, { createdAt: 'asc' }],
    });
    return rows.map(this.mapVideoAula);
  }


  async removeVideoAula(videoAulaId: string): Promise<void> {
    await prisma.videoAula.delete({ where: { id: videoAulaId } });
  }

  private mapCurso = (r: any): Curso => ({
    id: r.id,
    nome: r.nome,
    modality: r.modality,
    duracaoHoras: r.duracaoHoras,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  });

  private mapVideoAula = (r: any): VideoAula => ({
    id: r.id,
    cursoId: r.cursoId,
    moduloId: r.moduloId,
    titulo: r.titulo,
    descricao: r.descricao,
    urlVideo: r.urlVideo,
    ordem: r.ordem,
    duracaoMin: r.duracaoMin,
    createdAt: r.createdAt,
    liberarEm: r.liberarEm,
  });
  async createWithFinanceiro(
    cursoIn: CreateCursoInput,
    finIn: CreateFinanceiroForCursoInput
  ): Promise<{ curso: Curso; financeiro: FinanceiroDTO }> {
    const result = await prisma.$transaction(async (tx) => {
      const c = await tx.curso.create({
        data: {
          nome: cursoIn.nome,
          modality: cursoIn.modality as any,
          duracaoHoras: cursoIn.duracaoHoras ?? null,
        },
      });

      const f = await tx.financeiro.upsert({
        where: { cursoId: c.id }, // cursoId é unique -> 1:1
        update: {
          nome: finIn.nome,
          valorTotal: finIn.valorTotal as any,
          numeroParcelas: finIn.numeroParcelas,
          diaVencimento: finIn.diaVencimento ?? null,
          jurosAoMes: finIn.jurosAoMes as any,
          multaPercent: finIn.multaPercent as any,
        },
        create: {
          cursoId: c.id,
          nome: finIn.nome,
          valorTotal: finIn.valorTotal as any,
          numeroParcelas: finIn.numeroParcelas,
          diaVencimento: finIn.diaVencimento ?? null,
          jurosAoMes: finIn.jurosAoMes as any,
          multaPercent: finIn.multaPercent as any,
        },
      });

      return { c, f };
    });

    const curso: Curso = this.mapCurso(result.c);
    const financeiro: FinanceiroDTO = {
      id: result.f.id,
      cursoId: result.f.cursoId,
      nome: result.f.nome,
      valorTotal: Number(result.f.valorTotal),
      numeroParcelas: result.f.numeroParcelas,
      diaVencimento: result.f.diaVencimento,
      jurosAoMes: result.f.jurosAoMes ? Number(result.f.jurosAoMes) : null,
      multaPercent: result.f.multaPercent ? Number(result.f.multaPercent) : null,
      createdAt: result.f.createdAt,
      updatedAt: result.f.updatedAt,
    };

    return { curso, financeiro };
  }
}
