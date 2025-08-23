import type { AlunosRepository, UpdateAlunoInput } from '../../repositories/alunos-repository.js';
import { AppError } from '../../http/errors/app-error.js';

export class UpdateAlunoUseCase {
  constructor(private alunosRepo: AlunosRepository) {}

  async execute(id: string, data: UpdateAlunoInput) {
    const found = await this.alunosRepo.findById(id);
    if (!found) throw new AppError('Aluno não encontrado', 404);

    const payload: UpdateAlunoInput = {};
    if (data.nome !== undefined) payload.nome = data.nome;
    if (data.telefone !== undefined) payload.telefone = data.telefone;
    if (data.email !== undefined) payload.email = data.email;
    if (data.fotoUrl !== undefined) payload.fotoUrl = data.fotoUrl;
    if (data.rua !== undefined) payload.rua = data.rua;
    if (data.numero !== undefined) payload.numero = data.numero;
    if (data.bairro !== undefined) payload.bairro = data.bairro;
    if (data.cidade !== undefined) payload.cidade = data.cidade;

    const aluno = await this.alunosRepo.update(id, payload);
    return { aluno };
  }
}
