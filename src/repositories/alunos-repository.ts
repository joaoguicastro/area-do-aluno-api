export interface Aluno {
  id: string;
  nome: string;
  cpfAluno: string;
  dataNascimentoAluno: Date;

  nomeResponsavel: string;
  cpfResponsavel: string;
  dataNascimentoResponsavel: Date;

  rua: string;
  numero: string;
  bairro: string;
  cidade: string;

  telefone?: string | null;
  email?: string | null;
  fotoUrl?: string | null;

  createdAt: Date;
  updatedAt: Date;

  matricula: string;
}

export interface CreateAlunoInput {
  nome: string;
  cpfAluno: string;
  dataNascimentoAluno: Date;

  nomeResponsavel: string;
  cpfResponsavel: string;
  dataNascimentoResponsavel: Date;

  rua: string;
  numero: string;
  bairro: string;
  cidade: string;

  telefone?: string | null;
  email?: string | null;
  fotoUrl?: string | null;
  matricula: string;
}

export interface UpdateAlunoInput {
  nome?: string;
  telefone?: string | null;
  email?: string | null;
  fotoUrl?: string | null;

  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
}

export interface ListAlunosParams {
  q?: string;
  page?: number;
  perPage?: number;
}

export interface AlunosRepository {
  create(data: CreateAlunoInput): Promise<Aluno>;
  findById(id: string): Promise<Aluno | null>;
  findByCPF(cpf: string): Promise<Aluno | null>;
  list(params: ListAlunosParams): Promise<{ data: Aluno[]; total: number }>;
  update(id: string, data: UpdateAlunoInput): Promise<Aluno>;
  delete(id: string): Promise<void>;
}
