import type { ModulosRepository } from '../../repositories/modulos-repository.js';

export type CreateModuloInput = {
  cursoId: string;
  nome: string;
  ordem: number | null;
};

export class CreateModuloUseCase {
  constructor(private repo: ModulosRepository) {}

  async execute(input: CreateModuloInput) {
    const ordem = input.ordem ?? null;

    const modulo = await this.repo.create({
      cursoId: input.cursoId,
      nome: input.nome,
      ordem,
    });

    return { modulo };
  }
}
