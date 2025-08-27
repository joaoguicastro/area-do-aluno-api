import { PrismaClient, Prisma } from '@prisma/client';
import type { ProgressoRepository, VideoAulaProgresso } from '../progresso-repository.js';

const prisma = new PrismaClient();

export class PrismaProgressoRepository implements ProgressoRepository {
  async upsertProgress(params: {
    alunoId: string;
    cursoId: string;
    videoAulaId: string;
    positionSec?: number;
    completed?: boolean;
  }): Promise<VideoAulaProgresso> {
    const { alunoId, cursoId, videoAulaId, positionSec, completed } = params;

    const updateData: Prisma.VideoAulaProgressoUpdateInput = {};
    if (typeof positionSec === 'number') {
      updateData.positionSec = { set: Math.max(0, Math.floor(positionSec)) };
    }
    if (typeof completed === 'boolean') {
      updateData.completed = { set: completed };
      updateData.completedAt = { set: completed ? new Date() : null };
    }

    const row = await prisma.videoAulaProgresso.upsert({
      where: { alunoId_videoAulaId: { alunoId, videoAulaId } },
      create: {
        alunoId,
        cursoId,
        videoAulaId,
        positionSec: Math.max(0, Math.floor(positionSec ?? 0)),
        completed: !!completed,
        completedAt: completed ? new Date() : null,
      },
      update: updateData,
    });

    return row as unknown as VideoAulaProgresso;
  }

  async findManyByAlunoCurso(alunoId: string, cursoId: string): Promise<VideoAulaProgresso[]> {
    const rows = await prisma.videoAulaProgresso.findMany({
      where: { alunoId, cursoId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows as unknown as VideoAulaProgresso[];
  }

  async countVideoAulasDoCurso(cursoId: string): Promise<number> {
    return prisma.videoAula.count({ where: { cursoId } });
  }
}
