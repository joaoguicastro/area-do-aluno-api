import type { ModulosRepository } from '../../repositories/modulos-repository.js';

export type UpdateModuloInput = {
  id: string;
  nome?: string;
  ordem?: number | null;
};

export class UpdateModuloUseCase {
  constructor(private repo: ModulosRepository) {}

  async execute(input: UpdateModuloInput) {
    const data: { nome?: string; ordem?: number | null } = {};
    if (input.nome !== undefined) data.nome = input.nome;
    if (input.ordem !== undefined) data.ordem = input.ordem;

    const modulo = await this.repo.update({
      id: input.id,
      ...data,
    });

    return { modulo };
  }
}
