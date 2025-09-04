export type MatriculaStatus = 'ATIVA' | 'TRANCADA' | 'CANCELADA' | 'CONCLUIDA';

export interface Matricula {
  id: string;
  alunoId: string;
  cursoId: string;
  turmaId?: string | null;
  status: MatriculaStatus;
  dataInicio: Date;
  dataFim?: Date | null;
}

export interface CreateMatriculaInput {
  alunoId: string;
  cursoId: string;
  turmaId?: string | null;       
  status?: MatriculaStatus;      
  dataInicio?: Date;               
  dataFim?: Date | null;
}

export interface UpdateMatriculaInput {
  turmaId?: string | null;
  status?: MatriculaStatus;
  dataFim?: Date | null;
}

export interface ListMatriculasParams {
  alunoId?: string;
  cursoId?: string;
  turmaId?: string;
  status?: MatriculaStatus;
  page?: number;
  perPage?: number;
}

export interface MatriculasRepository {
  create(data: CreateMatriculaInput): Promise<Matricula>;
  findById(id: string): Promise<Matricula | null>;
  list(params: ListMatriculasParams): Promise<{ data: Matricula[]; total: number }>;
  update(id: string, data: UpdateMatriculaInput): Promise<Matricula>;
  delete(id: string): Promise<void>;

  findActiveByAlunoAndCurso(alunoId: string, cursoId: string): Promise<Matricula | null>;
  createWithParcelasFromCursoFinanceiro(data: CreateMatriculaInput): Promise<Matricula>;

}
