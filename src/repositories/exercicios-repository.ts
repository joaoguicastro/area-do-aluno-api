export interface Exercicio {
  id: string;
  cursoId: string;
  titulo: string;
  descricao?: string | null;
  dataEntrega?: Date | null;
  publicado: boolean;
  createdAt: Date;
}

export interface EntregaExercicio {
  id: string;
  exercicioId: string;
  alunoId: string;
  texto?: string | null;
  arquivoUrl?: string | null;
  enviadoEm: Date;
  nota?: number | null;
}

export interface CreateExercicioInput {
  cursoId: string;
  titulo: string;
  descricao?: string | null;
  dataEntrega?: Date | null;
  publicado?: boolean; 
}

export interface ListExerciciosParams {
  cursoId?: string;
  q?: string;
  publicados?: boolean;
  page?: number;
  perPage?: number;
}

export interface CreateEntregaInput {
  texto?: string | null;
  arquivoUrl?: string | null;
}

export interface ExerciciosRepository {
  create(data: CreateExercicioInput): Promise<Exercicio>;
  findById(id: string): Promise<Exercicio | null>;
  list(params: ListExerciciosParams): Promise<{ data: Exercicio[]; total: number }>;
  setPublicado(id: string, publicado: boolean): Promise<Exercicio>;
  delete(id: string): Promise<void>;

  findEntregaByExercicioAndAluno(exercicioId: string, alunoId: string): Promise<EntregaExercicio | null>;
  createEntrega(exercicioId: string, alunoId: string, data: CreateEntregaInput): Promise<EntregaExercicio>;
  updateEntrega(entregaId: string, data: CreateEntregaInput): Promise<EntregaExercicio>;
  listEntregas(exercicioId: string): Promise<EntregaExercicio[]>;
}
