export type VideoAulaProgresso = {
  id: string;
  alunoId: string;
  cursoId: string;
  videoAulaId: string;
  positionSec: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface ProgressoRepository {
  upsertProgress(params: {
    alunoId: string;
    cursoId: string;
    videoAulaId: string;
    positionSec?: number;
    completed?: boolean;
  }): Promise<VideoAulaProgresso>;

  findManyByAlunoCurso(alunoId: string, cursoId: string): Promise<VideoAulaProgresso[]>;

  countVideoAulasDoCurso(cursoId: string): Promise<number>;
}
