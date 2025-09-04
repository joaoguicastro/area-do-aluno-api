import { type FastifyRequest, type FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaFinanceirosRepository } from '../../../repositories/prisma/prisma-financeiros-repository.js'
import { GetFinanceiroByCursoUseCase } from '../../../use-cases/financeiro/get-financeiro-by-curso.js'

export async function getFinanceiroByCursoController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    cursoId: z.string().min(1),
  })
  const { cursoId } = paramsSchema.parse(req.params)

  const repo = new PrismaFinanceirosRepository()
  const useCase = new GetFinanceiroByCursoUseCase(repo)
  const { financeiro } = await useCase.execute(cursoId)

  if (!financeiro) return reply.status(404).send({ message: 'Financeiro não encontrado para este curso' })
  return reply.send(financeiro)
}
