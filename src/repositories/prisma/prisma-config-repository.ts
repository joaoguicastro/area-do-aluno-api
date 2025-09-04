import { prisma } from '../../core/prisma.js'
import type { ConfigRepository, SistemaConfigDTO } from '../config-repository.js'

export class PrismaConfigRepository implements ConfigRepository {
  async get(): Promise<SistemaConfigDTO> {
    const r = await prisma.configuracaoSystema.findFirst()
    if (r) return r
    return prisma.configuracaoSystema.create({
      data: { id: 'singleton', diasAtrasoBloqueio: 0 },
    })
  }

  async update(input: { diasAtrasoBloqueio: number }): Promise<SistemaConfigDTO> {
    const current = await this.get()
    return prisma.configuracaoSystema.update({
      where: { id: current.id },
      data: { diasAtrasoBloqueio: input.diasAtrasoBloqueio },
    })
  }
}
