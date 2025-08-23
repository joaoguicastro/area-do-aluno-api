import { Prisma } from '@prisma/client';
import { prisma } from '../../core/prisma.js';
import type {
  CursosRepository,
  CreateCursoInput,
  UpdateCursoInput,
  Curso,
  CreateVideoAulaInput,
  VideoAula,
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
    titulo: r.titulo,
    descricao: r.descricao,
    urlVideo: r.urlVideo,
    ordem: r.ordem,
    duracaoMin: r.duracaoMin,
    createdAt: r.createdAt,
  });
}
