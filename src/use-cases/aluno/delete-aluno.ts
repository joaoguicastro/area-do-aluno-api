import type { AlunosRepository } from '../../repositories/alunos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class DeleteAlunoUseCase {
  constructor(private alunosRepo: AlunosRepository) {}

  async execute(id: string) {
    const found = await this.alunosRepo.findById(id);
    if (!found) throw new AppError('Aluno não encontrado', 404);

    await this.alunosRepo.delete(id);
    return { ok: true };
  }
}
