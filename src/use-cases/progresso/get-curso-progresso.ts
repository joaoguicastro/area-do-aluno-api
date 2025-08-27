import type { ProgressoRepository } from '../../repositories/progresso-repository.js';

type Input = { alunoId: string; cursoId: string };
type Output = {
  lastVideoAulaId: string | null;
  doneIds: string[];
  positions: Record<string, number>;
  total: number;
  feitos: number;
  updatedAt: string | null;
};

export class GetCursoProgressoUseCase {
  constructor(private repo: ProgressoRepository) {}

  async execute({ alunoId, cursoId }: Input): Promise<{ progress: Output }> {
    const [rows, total] = await Promise.all([
      this.repo.findManyByAlunoCurso(alunoId, cursoId),
      this.repo.countVideoAulasDoCurso(cursoId),
    ]);

    const lastVideoAulaId = rows[0]?.videoAulaId ?? null;
    const doneIds = rows.filter((r) => r.completed).map((r) => r.videoAulaId);
    const positions = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.videoAulaId] = r.positionSec;
      return acc;
    }, {});
    const feitos = doneIds.length;
    const updatedAt = rows[0]?.updatedAt ?? null;

    return { progress: { lastVideoAulaId, doneIds, positions, total, feitos, updatedAt } };
  }
}
