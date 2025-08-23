import type { AlunosRepository } from '../../repositories/alunos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class GetAlunoUseCase {
  constructor(private alunosRepo: AlunosRepository) {}

  async execute(id: string) {
    const aluno = await this.alunosRepo.findById(id);
    if (!aluno) throw new AppError('Aluno não encontrado', 404);
    return { aluno };
  }
}
