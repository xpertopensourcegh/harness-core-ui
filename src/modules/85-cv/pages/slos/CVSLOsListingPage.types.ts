import type { SLODashboardWidget } from 'services/cv'

export interface CVSLOsListingPageProps {
  monitoredServiceIdentifier?: string
}

// SLOCardHeader

export interface SLOCardHeaderProps {
  serviceLevelObjective: SLODashboardWidget
  onDelete: (identifier: string, name: string) => void
  monitoredServiceIdentifier?: string
}

// SLOCardContent

export interface SLOCardContentProps {
  serviceLevelObjective: SLODashboardWidget
}

export enum SLOCardToggleViews {
  SLO = 'SLO',
  ERROR_BUDGET = 'ERROR_BUDGET'
}

export interface GetSLOAndErrorBudgetGraphOptions {
  minXLimit: number
  maxXLimit: number
  type: SLOCardToggleViews
  serviceLevelObjective: SLODashboardWidget
}
