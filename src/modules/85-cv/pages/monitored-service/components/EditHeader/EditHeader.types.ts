import type { MonitoredServiceDTO } from 'services/cv'

export interface EditHeaderProps {
  monitoredServiceData?: MonitoredServiceDTO
  lastModifiedAt?: number
}
