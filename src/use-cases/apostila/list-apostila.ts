import type {
    CreateApostilaInput,
    ApostilaRepository,
    Apostila,
} from "../../repositories/apostila-repository.js";
import { AppError } from "../../http/errors/app-error.js";

export class ListApostilaUseCase {
    constructor(
        private repo: ApostilaRepository,
    ) {}
    async execute(cursoId: string): Promise<Apostila[]> {
        const apostilas = await this.repo.listByCursoId(cursoId);
        if (!apostilas) {
            throw new AppError("Nenhuma apostila encontrada");
        }
        return apostilas;
    }
}
