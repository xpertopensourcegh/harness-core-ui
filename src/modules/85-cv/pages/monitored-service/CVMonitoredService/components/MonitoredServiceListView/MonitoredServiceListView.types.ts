import type { MonitoredServiceListItemDTO, SLODashboardWidget } from 'services/cv'

export interface NewMonitoredServiceListItemDTO extends MonitoredServiceListItemDTO {
  sloHealthIndicators?: SLOHealthIndicator[]
}

export interface SLOHealthIndicator {
  serviceLevelObjectiveIdentifier: string
  errorBudgetRemainingPercentage: number
  errorBudgetRisk: SLODashboardWidget['errorBudgetRisk']
}
