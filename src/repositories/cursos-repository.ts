export type Modality = 'ONLINE' | 'PRESENCIAL';

export interface Curso {
  id: string;
  nome: string;
  modality: Modality;
  duracaoHoras?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoAula {
  id: string;
  cursoId: string;
  titulo: string;
  descricao?: string | null;
  urlVideo: string;
  ordem?: number | null;
  duracaoMin?: number | null;
  createdAt: Date;
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
  removeVideoAula(videoAulaId: string): Promise<void>;
}
