export type Modulo = {
  id: string;
  cursoId: string;
  nome: string;
  ordem?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface CreateModuloInput {
  cursoId: string;
  nome: string;
  ordem?: number | null;
}

export interface UpdateModuloInput {
  id: string;
  nome?: string;
  ordem?: number | null;
}

export interface ModulosRepository {
  create(data: CreateModuloInput): Promise<Modulo>;
  listByCurso(cursoId: string): Promise<Modulo[]>;
  update(data: UpdateModuloInput): Promise<Modulo>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Modulo | null>;
}
