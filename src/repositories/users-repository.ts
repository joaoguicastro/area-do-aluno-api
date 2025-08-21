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

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
}
