// src/http/controllers/admin/config/update-config.controller.ts
import { z } from 'zod'
import { prisma } from '../../../core/prisma.js'
import { PrismaConfigRepository } from '../../../repositories/prisma/prisma-config-repository.js'

export async function updateSistemaConfigController(req: any, reply: any) {
  const sub = req.user?.sub || req.user?.id
  if (!sub) return reply.code(401).send({ message: 'Não autenticado' })

  const staff = await prisma.funcionario.findUnique({
    where: { id: String(sub) },
    select: { role: true },
  })
  if (!staff || staff.role !== 'MASTER') {
    return reply.code(403).send({ message: 'Apenas MASTER' })
  }

  const bodySchema = z.object({
    diasAtrasoBloqueio: z.number().int().min(0),
  })
  const { diasAtrasoBloqueio } = bodySchema.parse(req.body)

  const repo = new PrismaConfigRepository()
  const updated = await repo.update({ diasAtrasoBloqueio })
  return reply.send(updated)
}
