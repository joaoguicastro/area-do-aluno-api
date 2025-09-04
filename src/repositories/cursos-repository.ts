export type Modality = 'ONLINE' | 'PRESENCIAL';

export interface Curso {
  id: string;
  nome: string;
  modality: Modality;
  duracaoHoras?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFinanceiroForCursoInput {
  nome: string;
  valorTotal: number | string;       
  numeroParcelas: number;
  diaVencimento?: number | null;     
  jurosAoMes?: number | string | null;
  multaPercent?: number | string | null;
}

export interface FinanceiroDTO {
  id: string;
  cursoId: string;
  nome: string;
  valorTotal: number;
  numeroParcelas: number;
  diaVencimento?: number | null;
  jurosAoMes?: number | null;
  multaPercent?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface VideoAula {
  id: string;
  cursoId: string;
  moduloId?: string | null;
  titulo: string;
  descricao?: string | null;
  urlVideo: string;
  ordem?: number | null;
  duracaoMin?: number | null;
  createdAt: Date;
  liberarEm?: Date | null;
}

export interface CreateCursoInput {
  nome: string;
  modality: Modality;
  duracaoHoras?: number | null;
}

export interface UpdateCursoInput {
  nome?: string;
  modality?: Modality;
  duracaoHoras?: number | null;
}

export interface CreateVideoAulaInput {
  titulo: string;
  descricao?: string | null;
  urlVideo: string;
  ordem?: number | null;
  duracaoMin?: number | null;
  moduloId?: string | null;
  liberarEm?: Date | null;
}

export interface CursosRepository {
  create(data: CreateCursoInput): Promise<Curso>;
  findById(id: string): Promise<Curso | null>;
  findByName(nome: string): Promise<Curso | null>;
  list(params: { q?: string; page?: number; perPage?: number }): Promise<{ data: Curso[]; total: number }>;
  update(id: string, data: UpdateCursoInput): Promise<Curso>;
  delete(id: string): Promise<void>;

  addVideoAula(cursoId: string, data: CreateVideoAulaInput): Promise<VideoAula>;
  listVideoAulas(cursoId: string): Promise<VideoAula[]>;
  listVideoAulasLiberadas(cursoId: string, now: Date): Promise<VideoAula[]>; 
  removeVideoAula(videoAulaId: string): Promise<void>;
  createWithFinanceiro(
    curso: CreateCursoInput,
    financeiro: CreateFinanceiroForCursoInput
  ): Promise<{ curso: Curso; financeiro: FinanceiroDTO }>;

}
