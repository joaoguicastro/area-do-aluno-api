import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaParcelasRepository } from '../../../repositories/prisma/prisma-parcelas-repository.js'
import { BaixaParcelaUseCase } from '../../../use-cases/parcelas/baixa-parcela.js'

export async function baixaParcelaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) })
  const bodySchema = z.object({
    formaPagamento: z.enum(['DINHEIRO','PIX','CARTAO_CREDITO','BOLETO']),
    valorPago: z.union([z.number(), z.string()]),
    pagoEm: z.string().datetime().optional(),
  })

  const { id } = paramsSchema.parse(req.params)
  const { formaPagamento, valorPago, pagoEm } = bodySchema.parse(req.body)

  const repo = new PrismaParcelasRepository()
  const useCase = new BaixaParcelaUseCase(repo)
  const { parcela } = await useCase.execute({
    id,
    formaPagamento,
    valorPago,
    pagoEm: pagoEm ? new Date(pagoEm) : undefined,
  })

  return reply.send(parcela)
}
