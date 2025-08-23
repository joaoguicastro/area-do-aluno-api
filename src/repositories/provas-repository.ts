export type QuestaoTipo = 'MULTIPLA_ESCOLHA' | 'DISSERTATIVA';
export type ProvaStatusSubmissao = 'EM_ANDAMENTO' | 'ENVIADA' | 'CORRIGIDA';

export interface Prova {
  id: string;
  cursoId: string;
  titulo: string;
  descricao?: string | null;
  inicioEm?: Date | null;
  fimEm?: Date | null;
  duracaoMin?: number | null;
  publicado: boolean;
  createdAt: Date;
}

export interface ProvaQuestao {
  id: string;
  provaId: string;
  ordem?: number | null;
  tipo: QuestaoTipo;
  enunciado: string;
  valor?: number | null;
}

export interface ProvaQuestaoOpcao {
  id: string;
  questaoId: string;
  texto: string;
  correta: boolean;
  ordem?: number | null;
}

export interface ProvaSubmissao {
  id: string;
  provaId: string;
  alunoId: string;
  iniciadoEm: Date;
  finalizadoEm?: Date | null;
  notaTotal?: number | null;
  status: ProvaStatusSubmissao;
}

export interface ProvaResposta {
  id: string;
  submissaoId: string;
  questaoId: string;
  opcaoId?: string | null;
  respostaTxt?: string | null;
  correta?: boolean | null;
  nota?: number | null;
}

export interface CreateProvaInput {
  cursoId: string;
  titulo: string;
  descricao?: string | null;
  inicioEm?: Date | null;
  fimEm?: Date | null;
  duracaoMin?: number | null;
  publicado?: boolean;
}

export interface CreateQuestaoInput {
  tipo: QuestaoTipo;
  enunciado: string;
  valor?: number | null;
  ordem?: number | null;
}

export interface CreateOpcaoInput {
  texto: string;
  correta?: boolean;
  ordem?: number | null;
}

export interface ListProvasParams {
  cursoId?: string;
  publicados?: boolean;
  page?: number;
  perPage?: number;
}

export interface ProvasRepository {
  create(data: CreateProvaInput): Promise<Prova>;
  findById(id: string): Promise<Prova | null>;
  list(params: ListProvasParams): Promise<{ data: Prova[]; total: number }>;
  setPublicado(id: string, publicado: boolean): Promise<Prova>;

  addQuestao(provaId: string, data: CreateQuestaoInput): Promise<ProvaQuestao>;
  addOpcao(questaoId: string, data: CreateOpcaoInput): Promise<ProvaQuestaoOpcao>;
  listQuestoesComOpcoes(provaId: string): Promise<Array<ProvaQuestao & { opcoes: ProvaQuestaoOpcao[] }>>;
  findQuestaoById(id: string): Promise<ProvaQuestao | null>;

  findSubmissaoByProvaAndAluno(provaId: string, alunoId: string): Promise<ProvaSubmissao | null>;
  createSubmissao(provaId: string, alunoId: string): Promise<ProvaSubmissao>;
  upsertResposta(submissaoId: string, questaoId: string, data: { opcaoId?: string | null; respostaTxt?: string | null; correta?: boolean | null; nota?: number | null }): Promise<ProvaResposta>;
  listRespostas(submissaoId: string): Promise<ProvaResposta[]>;
  updateSubmissao(submissaoId: string, data: { finalizadoEm?: Date | null; notaTotal?: number | null; status?: ProvaStatusSubmissao }): Promise<ProvaSubmissao>;
}
