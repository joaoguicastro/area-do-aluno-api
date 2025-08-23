import { prisma } from '../../core/prisma.js';
import type {
  ProvasRepository,
  Prova, CreateProvaInput, ListProvasParams,
  ProvaQuestao, CreateQuestaoInput,
  ProvaQuestaoOpcao, CreateOpcaoInput,
  ProvaSubmissao, ProvaResposta,
} from '../provas-repository.js';

export class PrismaProvasRepository implements ProvasRepository {
  async create(data: CreateProvaInput): Promise<Prova> {
    const r = await prisma.prova.create({
      data: {
        cursoId: data.cursoId,
        titulo: data.titulo,
        descricao: data.descricao ?? null,
        inicioEm: data.inicioEm ?? null,
        fimEm: data.fimEm ?? null,
        duracaoMin: data.duracaoMin ?? null,
        publicado: data.publicado ?? false,
      },
    });
    return this.mapProva(r);
  }

  async findById(id: string): Promise<Prova | null> {
    const r = await prisma.prova.findUnique({ where: { id } });
    return r ? this.mapProva(r) : null;
  }

  async list(params: ListProvasParams): Promise<{ data: Prova[]; total: number }> {
    const { cursoId, publicados, page = 1, perPage = 10 } = params ?? {};
    const where: any = {};
    if (cursoId) where.cursoId = cursoId;
    if (publicados !== undefined) where.publicado = publicados;

    const [rows, total] = await Promise.all([
      prisma.prova.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.prova.count({ where }),
    ]);
    return { data: rows.map(this.mapProva), total };
  }

  async setPublicado(id: string, publicado: boolean): Promise<Prova> {
    const r = await prisma.prova.update({ where: { id }, data: { publicado } });
    return this.mapProva(r);
  }

  async addQuestao(provaId: string, data: CreateQuestaoInput): Promise<ProvaQuestao> {
    const r = await prisma.provaQuestao.create({
      data: {
        provaId,
        tipo: data.tipo as any,
        enunciado: data.enunciado,
        valor: data.valor ?? null,
        ordem: data.ordem ?? null,
      },
    });
    return this.mapQuestao(r);
  }

  async addOpcao(questaoId: string, data: CreateOpcaoInput): Promise<ProvaQuestaoOpcao> {
    const r = await prisma.provaQuestaoOpcao.create({
      data: {
        questaoId,
        texto: data.texto,
        correta: data.correta ?? false,
        ordem: data.ordem ?? null,
      },
    });
    return this.mapOpcao(r);
  }

  async listQuestoesComOpcoes(provaId: string) {
    const rows = await prisma.provaQuestao.findMany({
      where: { provaId },
      orderBy: [{ ordem: 'asc' }, { id: 'asc' }],
      include: { opcoes: { orderBy: [{ ordem: 'asc' }, { id: 'asc' }] } },
    });
    return rows.map((q: any) => ({
      ...this.mapQuestao(q),
      opcoes: q.opcoes.map(this.mapOpcao),
    }));
  }

  async findQuestaoById(id: string): Promise<ProvaQuestao | null> {
    const r = await prisma.provaQuestao.findUnique({ where: { id } });
    return r ? this.mapQuestao(r) : null;
  }

  async findSubmissaoByProvaAndAluno(provaId: string, alunoId: string): Promise<ProvaSubmissao | null> {
    const r = await prisma.provaSubmissao.findUnique({ where: { provaId_alunoId: { provaId, alunoId } } });
    return r ? this.mapSub(r) : null;
  }

  async createSubmissao(provaId: string, alunoId: string): Promise<ProvaSubmissao> {
    const r = await prisma.provaSubmissao.create({ data: { provaId, alunoId } });
    return this.mapSub(r);
  }

  async upsertResposta(submissaoId: string, questaoId: string, data: { opcaoId?: string | null; respostaTxt?: string | null; correta?: boolean | null; nota?: number | null }): Promise<ProvaResposta> {
    const existing = await prisma.provaResposta.findUnique({ where: { submissaoId_questaoId: { submissaoId, questaoId } } });
    if (existing) {
      const r = await prisma.provaResposta.update({
        where: { id: existing.id },
        data: {
          opcaoId: data.opcaoId ?? null,
          respostaTxt: data.respostaTxt ?? null,
          correta: data.correta ?? null,
          nota: data.nota ?? null,
        },
      });
      return this.mapResp(r);
    }
    const r = await prisma.provaResposta.create({
      data: {
        submissaoId,
        questaoId,
        opcaoId: data.opcaoId ?? null,
        respostaTxt: data.respostaTxt ?? null,
        correta: data.correta ?? null,
        nota: data.nota ?? null,
      },
    });
    return this.mapResp(r);
  }

  async listRespostas(submissaoId: string): Promise<ProvaResposta[]> {
    const rows = await prisma.provaResposta.findMany({ where: { submissaoId } });
    return rows.map(this.mapResp);
  }

  async updateSubmissao(submissaoId: string, data: { finalizadoEm?: Date | null; notaTotal?: number | null; status?: any }): Promise<ProvaSubmissao> {
    const upd: any = {};
    if (data.finalizadoEm !== undefined) upd.finalizadoEm = data.finalizadoEm;
    if (data.notaTotal !== undefined) upd.notaTotal = data.notaTotal;
    if (data.status !== undefined) upd.status = data.status;
    const r = await prisma.provaSubmissao.update({ where: { id: submissaoId }, data: upd });
    return this.mapSub(r);
  }

  private mapProva = (r: any): Prova => ({
    id: r.id,
    cursoId: r.cursoId,
    titulo: r.titulo,
    descricao: r.descricao,
    inicioEm: r.inicioEm,
    fimEm: r.fimEm,
    duracaoMin: r.duracaoMin,
    publicado: r.publicado,
    createdAt: r.createdAt,
  });
  private mapQuestao = (r: any): ProvaQuestao => ({
    id: r.id, provaId: r.provaId, ordem: r.ordem, tipo: r.tipo, enunciado: r.enunciado, valor: r.valor,
  });
  private mapOpcao = (r: any): ProvaQuestaoOpcao => ({
    id: r.id, questaoId: r.questaoId, texto: r.texto, correta: r.correta, ordem: r.ordem,
  });
  private mapSub = (r: any): ProvaSubmissao => ({
    id: r.id, provaId: r.provaId, alunoId: r.alunoId, iniciadoEm: r.iniciadoEm, finalizadoEm: r.finalizadoEm, notaTotal: r.notaTotal, status: r.status,
  });
  private mapResp = (r: any): ProvaResposta => ({
    id: r.id, submissaoId: r.submissaoId, questaoId: r.questaoId, opcaoId: r.opcaoId, respostaTxt: r.respostaTxt, correta: r.correta, nota: r.nota,
  });
}
