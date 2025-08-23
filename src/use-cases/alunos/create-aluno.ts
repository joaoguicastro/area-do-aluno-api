import type { AlunosRepository, CreateAlunoInput } from '../../repositories/alunos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class CreateAlunoUseCase {
  constructor(private alunosRepo: AlunosRepository) {}

  async execute(input: CreateAlunoInput) {
    const exists = await this.alunosRepo.findByCPF(input.cpfAluno);
    if (exists) throw new AppError('CPF do aluno já cadastrado', 409);

    const aluno = await this.alunosRepo.create(input);
    return { aluno };
  }
}
