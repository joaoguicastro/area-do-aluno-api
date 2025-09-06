import { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import type {
    CreateApostilaInput,
    Apostila,
    ApostilaRepository,
} from "../apostila-repository.js";

export class PrismaApostilaRepository implements ApostilaRepository {
    async create(data: CreateApostilaInput): Promise<Apostila> {
        const r = await prisma.apostila.create({ data: {
            cursoId: data.cursoId,
            titulo: data.titulo,
            urlPdf: data.urlPdf,
        }});
        return this.mapApostila(r);
    }
    async findById(id: string): Promise<Apostila | null> {
        const r = await prisma.apostila.findUnique({ where: { id } });
        return r ? this.mapApostila(r) : null;
    }
    async listByCursoId(cursoId: string): Promise<Apostila[]> {
        const rows = await prisma.apostila.findMany({ where: { cursoId }, orderBy: { createdAt: 'desc' } });
        return rows.map(this.mapApostila);
    }
    async delete(id: string): Promise<void> {
        await prisma.apostila.delete({ where: { id } });
    }
    private mapApostila(r: Prisma.ApostilaGetPayload<{ }>): Apostila {
    return {
        id: r.id,
        cursoId: r.cursoId,
        titulo: r.titulo,
        urlPdf: r.urlPdf,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
    };
    }
}
