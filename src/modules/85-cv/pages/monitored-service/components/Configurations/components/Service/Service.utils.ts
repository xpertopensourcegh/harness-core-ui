import type { MonitoredServiceDTO } from 'services/cv'
import type { MonitoredServiceForm } from './Service.types'

export const getInitFormData = (
  data: MonitoredServiceDTO | undefined,
  defaultMonitoredService: MonitoredServiceDTO | undefined,
  isEdit: boolean
): MonitoredServiceForm => {
  const monitoredServiceData = isEdit ? data : defaultMonitoredService

  const {
    name = '',
    identifier = '',
    description = '',
    tags = {},
    serviceRef = '',
    environmentRef = '',
    sources
  } = monitoredServiceData || {}

  return {
    isEdit,
    name,
    identifier,
    description,
    tags,
    serviceRef,
    environmentRef,
    sources
  }
}
