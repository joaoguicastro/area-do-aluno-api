export type Role = 'MASTER' | 'ADMIN' | 'OPERADOR' | 'PROFESSOR';

export interface User {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  nome: string;
  email: string;
  senhaHash: string;
  role: Role;
}

export type ListUsersParams = {
  page: number;
  perPage: number;
  q?: string;
};

export type ListUsersResult = {
  data: User[];
  total: number;
  page: number;
  perPage: number;
};

export type UpdateUserInput = {
  id: string;
  nome?: string;
  email?: string;
  role?: Role;
  senhaHash?: string;
};

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  delete(data: { id: string }): Promise<void>;

  list(params: ListUsersParams): Promise<ListUsersResult>;
  update(data: UpdateUserInput): Promise<User>;
}
