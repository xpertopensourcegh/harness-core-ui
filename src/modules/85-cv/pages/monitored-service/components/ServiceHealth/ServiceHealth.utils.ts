import type { SelectOption } from '@wings-software/uicore'
import type { UseStringsReturn } from 'framework/strings'

export const getTimePeriods = (getString: UseStringsReturn['getString']): SelectOption[] => {
  return [
    { value: 'Last 4 hours', label: getString('cv.monitoredServices.serviceHealth.last4Hrs') },
    { value: 'Last 24 hours', label: getString('cv.monitoredServices.serviceHealth.last24Hrs') },
    { value: 'Last 3 days', label: getString('cv.monitoredServices.serviceHealth.last3Days') },
    { value: 'Last 7 days', label: getString('cv.monitoredServices.serviceHealth.last7Days') },
    { value: 'Last 30 days', label: getString('cd.serviceDashboard.month') }
  ]
}
