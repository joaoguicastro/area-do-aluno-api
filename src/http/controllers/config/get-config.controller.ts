// src/http/controllers/admin/config/get-config.controller.ts
import { prisma } from '../../../core/prisma.js'
import { PrismaConfigRepository } from '../../../repositories/prisma/prisma-config-repository.js'

export async function getSistemaConfigController(req: any, reply: any) {
  const sub = req.user?.sub || req.user?.id
  if (!sub) return reply.code(401).send({ message: 'Não autenticado' })

  const staff = await prisma.funcionario.findUnique({
    where: { id: String(sub) },
    select: { role: true },
  })
  if (!staff || (staff.role !== 'MASTER' && staff.role !== 'ADMIN')) {
    return reply.code(403).send({ message: 'Apenas ADMIN/MASTER' })
  }

  const repo = new PrismaConfigRepository()
  const config = await repo.get()
  return reply.send(config)
}
