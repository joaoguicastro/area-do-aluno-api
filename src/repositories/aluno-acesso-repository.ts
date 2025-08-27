export interface CreateAlunoAcessoInput {
  alunoId: string;
  senhaHash: string;
}
export interface AlunoAcessoRepository {
  create(data: CreateAlunoAcessoInput): Promise<void>;
}
