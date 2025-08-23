import type { ProvasRepository } from '../../repositories/provas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class RespondQuestaoUseCase {
  constructor(private repo: ProvasRepository) {}

  async execute(submissaoId: string, questaoId: string, input: { opcaoId?: string | null; respostaTxt?: string | null }) {
    const q = await this.repo.findQuestaoById(questaoId);
    if (!q) throw new AppError('Questão não encontrada', 404);

    let correta: boolean | null = null;
    let nota: number | null = null;

    if (q.tipo === 'MULTIPLA_ESCOLHA') {
      if (!input.opcaoId) throw new AppError('opcaoId é obrigatório para múltipla escolha', 400);
      const qs = await this.repo.listQuestoesComOpcoes(q.provaId);
      const found = qs.find((x) => x.id === q.id);
      const corretaOpc = found?.opcoes.find((o) => o.id === input.opcaoId);
      if (!corretaOpc) throw new AppError('Opção inválida para esta questão', 400);
      correta = corretaOpc.correta;
      nota = correta ? (q.valor ?? 1) : 0;
    } else {
      if (input.respostaTxt == null || input.respostaTxt.trim() === '') {
        throw new AppError('respostaTxt é obrigatório para questão dissertativa', 400);
      }
      correta = null;
      nota = null;
    }

    const resp = await this.repo.upsertResposta(submissaoId, questaoId, {
      opcaoId: input.opcaoId ?? null,
      respostaTxt: input.respostaTxt ?? null,
      correta,
      nota,
    });

    return { resposta: resp };
  }
}
