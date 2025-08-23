import type { ProvasRepository, CreateQuestaoInput } from '../../repositories/provas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class AddQuestaoUseCase {
  constructor(private repo: ProvasRepository) {}

  async execute(provaId: string, input: CreateQuestaoInput) {
    const prova = await this.repo.findById(provaId);
    if (!prova) throw new AppError('Prova não encontrada', 404);
    if (prova.publicado) throw new AppError('Não é possível adicionar questões em prova publicada', 409);

    let ordem = input.ordem ?? null;
    if (ordem == null) {
      const qs = await this.repo.listQuestoesComOpcoes(provaId);
      const max = qs.reduce((m, q) => (q.ordem != null && q.ordem > m ? q.ordem : m), 0);
      ordem = max + 1;
    }

    const q = await this.repo.addQuestao(provaId, {
      tipo: input.tipo,
      enunciado: input.enunciado,
      valor: input.valor ?? null,
      ordem,
    });
    return { questao: q };
  }
}
