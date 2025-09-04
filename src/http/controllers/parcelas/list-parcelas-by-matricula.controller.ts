import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaParcelasRepository } from '../../../repositories/prisma/prisma-parcelas-repository.js'
import { ListParcelasByMatriculaUseCase } from '../../../use-cases/parcelas/list-parcelas-by-matricula.js'

export async function listParcelasByMatriculaController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    matriculaId: z.string().min(1),
  })
  const { matriculaId } = paramsSchema.parse(req.params)

  const repo = new PrismaParcelasRepository()
  const useCase = new ListParcelasByMatriculaUseCase(repo)
  const { parcelas } = await useCase.execute(matriculaId)

  return reply.send(parcelas) 
}
