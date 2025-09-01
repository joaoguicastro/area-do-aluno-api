import { prisma } from '../../core/prisma.js';
import type {
  ModulosRepository,
  CreateModuloInput,
  UpdateModuloInput,
  Modulo,
} from '../modulos-repository.js';

export class PrismaModulosRepository implements ModulosRepository {
  async create(data: CreateModuloInput): Promise<Modulo> {
    const r = await prisma.modulo.create({
      data: {
        cursoId: data.cursoId,
        nome: data.nome,
        ordem: data.ordem ?? null,
      },
    });
    return r as unknown as Modulo;
  }

  async listByCurso(cursoId: string): Promise<Modulo[]> {
    const rows = await prisma.modulo.findMany({
      where: { cursoId },
      orderBy: [{ ordem: 'asc' }, { createdAt: 'asc' }],
    });
    return rows as unknown as Modulo[];
  }

  async update(data: UpdateModuloInput): Promise<Modulo> {
    const r = await prisma.modulo.update({
      where: { id: data.id },
      data: {
        ...(data.nome !== undefined ? { nome: data.nome } : {}),
        ...(data.ordem !== undefined ? { ordem: data.ordem } : {}),
      },
    });
    return r as unknown as Modulo;
  }

  async delete(id: string): Promise<void> {
    await prisma.modulo.delete({ where: { id } });
  }

  async findById(id: string): Promise<Modulo | null> {
    const r = await prisma.modulo.findUnique({ where: { id } });
    return (r as unknown as Modulo) ?? null;
  }
}
