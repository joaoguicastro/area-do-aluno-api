import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaFinanceirosRepository } from '../../../repositories/prisma/prisma-financeiros-repository.js'
import { UpsertFinanceiroCursoUseCase } from '../../../use-cases/financeiro/upsert-financeiro-curso.js'

export async function upsertFinanceiroCursoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    cursoId: z.string().min(1),
  })
  const bodySchema = z.object({
    nome: z.string().min(1),
    valorTotal: z.union([z.number(), z.string()]),
    numeroParcelas: z.number().int().min(1),
    diaVencimento: z.number().int().min(1).max(28).nullable().optional(),
    jurosAoMes: z.union([z.number(), z.string()]).nullable().optional(),
    multaPercent: z.union([z.number(), z.string()]).nullable().optional(),
  })

  const { cursoId } = paramsSchema.parse(req.params)
  const data = bodySchema.parse(req.body)

  const repo = new PrismaFinanceirosRepository()
  const useCase = new UpsertFinanceiroCursoUseCase(repo)

  const { financeiro } = await useCase.execute({
    cursoId,
    ...data,
  })

  return reply.status(200).send(financeiro)
}
