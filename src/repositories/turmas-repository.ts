export interface Turma {
  id: string;
  cursoId: string;
  nome?: string | null;
  capacidade?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TurmaHorario {
  id: string;
  turmaId: string;
  diaSemana: number; 
  inicio: string;    
  fim: string;    
}

export interface CreateTurmaInput {
  cursoId: string;
  nome?: string | null;
  capacidade?: number | null;
}

export interface UpdateTurmaInput {
  nome?: string;
  capacidade?: number;
}

export interface CreateHorarioInput {
  diaSemana: number;
  inicio: string;
  fim: string;
}

export interface ListTurmasParams {
  cursoId?: string;
  q?: string;
  page?: number;
  perPage?: number;
}

export interface TurmasRepository {
  create(data: CreateTurmaInput): Promise<Turma>;
  findById(id: string): Promise<Turma | null>;
  findByIdCurso(cursoId: string): Promise<Turma | null>;
  list(params: ListTurmasParams): Promise<{ data: Turma[]; total: number }>;
  update(id: string, data: UpdateTurmaInput): Promise<Turma>;
  delete(id: string): Promise<void>;

  addHorario(turmaId: string, data: CreateHorarioInput): Promise<TurmaHorario>;
  listHorarios(turmaId: string): Promise<TurmaHorario[]>;
  removeHorario(horarioId: string): Promise<void>;
}
