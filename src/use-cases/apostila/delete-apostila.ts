import type {
    CreateApostilaInput,
    ApostilaRepository,
    Apostila,
} from "../../repositories/apostila-repository.js";
import { AppError } from "../../http/errors/app-error.js";

export class DeleteApostilaUseCase {
    constructor(
        private repo: ApostilaRepository,
    ) {}

    async execute(id: string): Promise<void> {
        const apostila = await this.repo.findById(id);
        if (!apostila) {
            throw new AppError("Apostila não encontrada");
        }
        await this.repo.delete(id);
    }
}