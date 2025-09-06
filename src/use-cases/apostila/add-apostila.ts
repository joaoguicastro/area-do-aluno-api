import type {
    CreateApostilaInput,
    ApostilaRepository,
    Apostila,
} from "../../repositories/apostila-repository.js";
import type { CursosRepository } from "../../repositories/cursos-repository.js";
import { AppError } from "../../http/errors/app-error.js";

export class AddApostilaUseCase {
    constructor(
        private repo: ApostilaRepository,
        private cursosRepo: CursosRepository,
    ) {}

    async execute(data: CreateApostilaInput): Promise<Apostila> {
        const curso = await this.cursosRepo.findById(data.cursoId);
        if (!curso) {
            throw new AppError("Curso não encontrado");
        }
        return this.repo.create(data);
    }
}