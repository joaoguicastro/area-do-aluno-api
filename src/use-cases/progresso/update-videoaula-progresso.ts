import type { ProgressoRepository } from '../../repositories/progresso-repository.js';

type Input = {
  alunoId: string;
  cursoId: string;
  videoAulaId: string;
  positionSec?: number;
  completed?: boolean;
};

export class UpdateVideoAulaProgressoUseCase {
  constructor(private repo: ProgressoRepository) {}

  async execute(input: Input) {
    const args: {
      alunoId: string;
      cursoId: string;
      videoAulaId: string;
    } & Partial<{ positionSec: number; completed: boolean }> = {
      alunoId: input.alunoId,
      cursoId: input.cursoId,
      videoAulaId: input.videoAulaId,
    };

    if (typeof input.positionSec === 'number') {
      args.positionSec = Math.max(0, Math.floor(input.positionSec));
    }
    if (typeof input.completed === 'boolean') {
      args.completed = input.completed;
    }

    const updated = await this.repo.upsertProgress(args);
    return { progresso: updated };
  }
}
