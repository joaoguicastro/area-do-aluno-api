import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaParcelasRepository } from '../../../repositories/prisma/prisma-parcelas-repository.js'
import { EstornoParcelaUseCase } from '../../../use-cases/parcelas/estorno-parcela.js'

export async function estornoParcelaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) })
  const { id } = paramsSchema.parse(req.params)

  const repo = new PrismaParcelasRepository()
  const useCase = new EstornoParcelaUseCase(repo)
  const { parcela } = await useCase.execute(id)

  return reply.send(parcela)
}
