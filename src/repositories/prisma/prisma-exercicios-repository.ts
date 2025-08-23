import { prisma } from '../../core/prisma.js';
import type {
  ExerciciosRepository,
  Exercicio,
  EntregaExercicio,
  CreateExercicioInput,
  ListExerciciosParams,
  CreateEntregaInput,
} from '../exercicios-repository.js';

export class PrismaExerciciosRepository implements ExerciciosRepository {
  async create(data: CreateExercicioInput): Promise<Exercicio> {
    const r = await prisma.exercicio.create({
      data: {
        cursoId: data.cursoId,
        titulo: data.titulo,
        descricao: data.descricao ?? null,
        dataEntrega: data.dataEntrega ?? null,
        publicado: data.publicado ?? false,
      },
    });
    return this.mapEx(r);
  }

  async findById(id: string): Promise<Exercicio | null> {
    const r = await prisma.exercicio.findUnique({ where: { id } });
    return r ? this.mapEx(r) : null;
  }

  async list(params: ListExerciciosParams): Promise<{ data: Exercicio[]; total: number }> {
    const { cursoId, q, publicados, page = 1, perPage = 10 } = params ?? {};
    const where: any = {};
    if (cursoId) where.cursoId = cursoId;
    if (publicados !== undefined) where.publicado = publicados;
    if (q) where.titulo = { contains: q, mode: 'insensitive' };

    const [rows, total] = await Promise.all([
      prisma.exercicio.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.exercicio.count({ where }),
    ]);

    return { data: rows.map(this.mapEx), total };
  }

  async setPublicado(id: string, publicado: boolean): Promise<Exercicio> {
    const r = await prisma.exercicio.update({
      where: { id },
      data: { publicado },
    });
    return this.mapEx(r);
  }

  async delete(id: string): Promise<void> {
    await prisma.exercicio.delete({ where: { id } });
  }

  // Entregas
  async findEntregaByExercicioAndAluno(exercicioId: string, alunoId: string): Promise<EntregaExercicio | null> {
    const r = await prisma.entregaExercicio.findUnique({
      where: { exercicioId_alunoId: { exercicioId, alunoId } },
    });
    return r ? this.mapEnt(r) : null;
  }

  async createEntrega(exercicioId: string, alunoId: string, data: CreateEntregaInput): Promise<EntregaExercicio> {
    const r = await prisma.entregaExercicio.create({
      data: {
        exercicioId,
        alunoId,
        texto: data.texto ?? null,
        arquivoUrl: data.arquivoUrl ?? null,
      },
    });
    return this.mapEnt(r);
  }

  async updateEntrega(entregaId: string, data: CreateEntregaInput): Promise<EntregaExercicio> {
    const r = await prisma.entregaExercicio.update({
      where: { id: entregaId },
      data: {
        texto: data.texto ?? null,
        arquivoUrl: data.arquivoUrl ?? null,
      },
    });
    return this.mapEnt(r);
  }

  async listEntregas(exercicioId: string): Promise<EntregaExercicio[]> {
    const rows = await prisma.entregaExercicio.findMany({
      where: { exercicioId },
      orderBy: { enviadoEm: 'desc' },
    });
    return rows.map(this.mapEnt);
  }

  private mapEx = (r: any): Exercicio => ({
    id: r.id,
    cursoId: r.cursoId,
    titulo: r.titulo,
    descricao: r.descricao,
    dataEntrega: r.dataEntrega,
    publicado: r.publicado,
    createdAt: r.createdAt,
  });

  private mapEnt = (r: any): EntregaExercicio => ({
    id: r.id,
    exercicioId: r.exercicioId,
    alunoId: r.alunoId,
    texto: r.texto,
    arquivoUrl: r.arquivoUrl,
    enviadoEm: r.enviadoEm,
    nota: r.nota,
  });
}
