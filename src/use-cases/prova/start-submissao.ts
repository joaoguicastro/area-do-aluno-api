import type { ProvasRepository } from '../../repositories/provas-repository.js';
import type { MatriculasRepository } from '../../repositories/matriculas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class StartSubmissaoUseCase {
  constructor(private repo: ProvasRepository, private matriculasRepo: MatriculasRepository) {}

  async execute(provaId: string, alunoId: string) {
    const prova = await this.repo.findById(provaId);
    if (!prova) throw new AppError('Prova não encontrada', 404);
    if (!prova.publicado) throw new AppError('Prova não publicada', 409);

    const now = new Date();
    if (prova.inicioEm && now < prova.inicioEm) throw new AppError('Prova ainda não iniciou', 403);
    if (prova.fimEm && now > prova.fimEm) throw new AppError('Prova encerrada', 403);

    const active = await this.matriculasRepo.findActiveByAlunoAndCurso(alunoId, prova.cursoId);
    if (!active) throw new AppError('Aluno sem matrícula ATIVA no curso desta prova', 403);

    const existing = await this.repo.findSubmissaoByProvaAndAluno(provaId, alunoId);
    if (existing) {
      if (existing.status === 'EM_ANDAMENTO') return { submissao: existing, resumed: true };
      throw new AppError('Submissão já existente para esta prova', 409);
    }

    const sub = await this.repo.createSubmissao(provaId, alunoId);
    return { submissao: sub, resumed: false };
  }
}
