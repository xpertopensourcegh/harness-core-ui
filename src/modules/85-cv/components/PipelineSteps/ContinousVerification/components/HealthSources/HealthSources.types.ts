import type { HealthSource } from 'services/cv'

export interface HealthSourcesProps {
  healthSources?: HealthSource[]
  isRunTimeInput?: boolean
  editHealthSource: (row: HealthSource) => void
  addHealthSource?: () => void
}
