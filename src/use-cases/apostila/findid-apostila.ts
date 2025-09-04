import type {
    CreateApostilaInput,
    ApostilaRepository,
    Apostila,
} from "../../repositories/apostila-repository.js";
import { AppError } from "../../http/errors/app-error.js";

export class FindApostilaByIdUseCase {
    constructor(
        private repo: ApostilaRepository,
    ) {}

    async execute(id: string): Promise<Apostila> {
        const apostila = await this.repo.findById(id);
        if (!apostila) {
            throw new AppError("Apostila não encontrada");
        }
        return apostila;
    }
}
