import { prisma } from '../../core/prisma.js';
import type {
  InformativosRepository,
  CreateInformativoInput,
  Informativo,
  ListParams,
  ListResult,
} from '../informativos-repository.js';

function map(r: any): Informativo {
  return {
    id: r.id,
    titulo: r.titulo,
    conteudo: r.conteudo,
    publicado: r.publicado,
    cursoId: r.cursoId ?? null,
    turmaId: r.turmaId ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export class PrismaInformativosRepository implements InformativosRepository {
  async create(data: CreateInformativoInput): Promise<Informativo> {
    const r = await prisma.informativo.create({
      data: {
        titulo: data.titulo,
        conteudo: data.conteudo,
        publicado: data.publicado ?? true,
        cursoId: data.cursoId ?? null,
        turmaId: data.turmaId ?? null,
      },
    });
    return map(r);
  }

  async list(params: ListParams): Promise<ListResult> {
    const { page, perPage, q } = params;
    const where = {
      ...(q
        ? {
            OR: [
              { titulo: { contains: q, mode: 'insensitive' as const } },
              { conteudo: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.informativo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.informativo.count({ where }),
    ]);

    return { data: rows.map(map), total, page, perPage };
  }

  async listForAluno(alunoId: string, params: ListParams): Promise<ListResult> {
    const { page, perPage, q } = params;

    // cursos/turmas ATIVAS do aluno
    const mats = await prisma.matricula.findMany({
      where: { alunoId, status: 'ATIVA' },
      select: { cursoId: true, turmaId: true },
    });
    const cursoIds = Array.from(new Set(mats.map(m => m.cursoId)));
    const turmaIds = Array.from(new Set(mats.map(m => m.turmaId).filter(Boolean) as string[]));

    const where = {
      publicado: true,
      ...(q
        ? {
            AND: [
              {
                OR: [
                  { titulo: { contains: q, mode: 'insensitive' as const } },
                  { conteudo: { contains: q, mode: 'insensitive' as const } },
                ],
              },
            ],
          }
        : {}),
      OR: [
        // global
        { AND: [{ cursoId: null }, { turmaId: null }] },
        // por curso
        ...(cursoIds.length ? [{ cursoId: { in: cursoIds } }] : []),
        // por turma
        ...(turmaIds.length ? [{ turmaId: { in: turmaIds } }] : []),
      ],
    };

    const [rows, total] = await Promise.all([
      prisma.informativo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.informativo.count({ where }),
    ]);

    return { data: rows.map(map), total, page, perPage };
  }

  async delete(id: string): Promise<void> {
    await prisma.informativo.delete({ where: { id } });
  }
}
