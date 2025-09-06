export interface Apostila{
    id: string;
    cursoId: string;
    titulo: string;
    urlPdf: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateApostilaInput{
    cursoId: string;
    titulo: string;
    urlPdf: string;
}


export interface ApostilaRepository{
    create(data: CreateApostilaInput): Promise<Apostila>;
    findById(id: string): Promise<Apostila | null>;
    listByCursoId(cursoId: string): Promise<Apostila[]>;
    delete(id: string): Promise<void>;
}