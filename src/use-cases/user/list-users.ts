import type {
  UsersRepository,
  ListUsersParams,
  ListUsersResult,
} from '../../repositories/users-repository.js';

export class ListUsersUseCase {
  private repo: UsersRepository;

  constructor(repo: UsersRepository) {
    this.repo = repo;
  }

  async execute(input: { page: number; perPage: number; q?: string | undefined }): Promise<ListUsersResult> {
    const params: ListUsersParams = {
      page: input.page,
      perPage: input.perPage,
    };
    if (input.q !== undefined && input.q !== '') params.q = input.q;

    return this.repo.list(params);
  }
}
