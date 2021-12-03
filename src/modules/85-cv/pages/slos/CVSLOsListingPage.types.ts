import type { ServiceLevelObjectiveDTO } from 'services/cv'

export interface CVSLOsListingPageProps {
  monitoredServiceIdentifier?: string
}

// SLOCardHeader

export interface SLOCardHeaderProps extends ServiceLevelObjectiveDTO {
  monitoredServiceIdentifier?: string
  onDelete: (identifier: string, name: string) => void
}
