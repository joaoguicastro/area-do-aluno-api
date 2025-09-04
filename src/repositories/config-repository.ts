export interface SistemaConfigDTO {
  id: string
  diasAtrasoBloqueio: number
  updatedAt: Date
}

export interface ConfigRepository {
  get(): Promise<SistemaConfigDTO>
  update(input: { diasAtrasoBloqueio: number }): Promise<SistemaConfigDTO>
}
