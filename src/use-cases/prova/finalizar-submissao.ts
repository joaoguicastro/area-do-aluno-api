import type { ProvasRepository } from '../../repositories/provas-repository.js';

export class FinalizarSubmissaoUseCase {
  constructor(private repo: ProvasRepository) {}

  async execute(submissaoId: string) {
    const respostas = await this.repo.listRespostas(submissaoId);
    const todasTemNota = respostas.every((r) => r.nota != null);
    const total = respostas.reduce((sum, r) => sum + (r.nota ?? 0), 0);

    const sub = await this.repo.updateSubmissao(submissaoId, {
      finalizadoEm: new Date(),
      notaTotal: total,
      status: todasTemNota ? 'CORRIGIDA' : 'ENVIADA',
    });

    return { submissao: sub };
  }
}
