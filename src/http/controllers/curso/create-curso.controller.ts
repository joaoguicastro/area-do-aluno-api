import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaCursosRepository } from '../../../repositories/prisma/prisma-cursos-repository.js'
import { CreateCursoUseCase } from '../../../use-cases/curso/create-curso.js'

export async function createCursoController(req: FastifyRequest, reply: FastifyReply) {
  const financeiroSchema = z.object({
    nome: z.string().min(1),
    valorTotal: z.union([z.number(), z.string()]),
    numeroParcelas: z.number().int().min(1),
    diaVencimento: z.number().int().min(1).max(28).nullable().optional(),
    jurosAoMes: z.union([z.number(), z.string()]).nullable().optional(),
    multaPercent: z.union([z.number(), z.string()]).nullable().optional(),
  })

  const bodySchema = z.object({
    nome: z.string().min(2),
    modality: z.enum(['ONLINE', 'PRESENCIAL']),
    duracaoHoras: z.coerce.number().int().positive().nullable().optional(),
    financeiro: financeiroSchema.optional(),
  })

  const data = bodySchema.parse(req.body)

  const repo = new PrismaCursosRepository()
  const useCase = new CreateCursoUseCase(repo)

  const { curso, financeiro } = await useCase.execute({
    nome: data.nome,
    modality: data.modality,
    duracaoHoras: data.duracaoHoras ?? null,
    ...(data.financeiro ? { financeiro: {
      nome: data.financeiro.nome,
      valorTotal: data.financeiro.valorTotal,
      numeroParcelas: data.financeiro.numeroParcelas,
      diaVencimento: data.financeiro.diaVencimento ?? null,
      jurosAoMes: data.financeiro.jurosAoMes ?? null,
      multaPercent: data.financeiro.multaPercent ?? null,
    }} : {})
  })

  return reply.status(201).send({ curso, ...(financeiro ? { financeiro } : {}) })
}
