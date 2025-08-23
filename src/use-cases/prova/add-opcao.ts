import type { ProvasRepository, CreateOpcaoInput } from '../../repositories/provas-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class AddOpcaoUseCase {
  constructor(private repo: ProvasRepository) {}

  async execute(questaoId: string, input: CreateOpcaoInput) {
    const q = await this.repo.findQuestaoById(questaoId);
    if (!q) throw new AppError('Questão não encontrada', 404);
    if (q.tipo !== 'MULTIPLA_ESCOLHA') throw new AppError('Opções só são permitidas em múltipla escolha', 409);

    const opc = await this.repo.addOpcao(questaoId, {
      texto: input.texto,
      correta: input.correta ?? false,
      ordem: input.ordem ?? null,
    });
    return { opcao: opc };
  }
}
