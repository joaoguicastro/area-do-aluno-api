export type Informativo = {
  id: string;
  titulo: string;
  conteudo: string;
  publicado: boolean;
  cursoId: string | null;
  turmaId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateInformativoInput = {
  titulo: string;
  conteudo: string;
  publicado?: boolean;
  cursoId?: string | null;
  turmaId?: string | null;
};

export type ListParams = {
  q?: string;
  page: number;
  perPage: number;
};

export type ListResult = {
  data: Informativo[];
  total: number;
  page: number;
  perPage: number;
};

export interface InformativosRepository {
  create(data: CreateInformativoInput): Promise<Informativo>;
  list(params: ListParams): Promise<ListResult>;
  listForAluno(alunoId: string, params: ListParams): Promise<ListResult>;
  delete(id: string): Promise<void>;
}
