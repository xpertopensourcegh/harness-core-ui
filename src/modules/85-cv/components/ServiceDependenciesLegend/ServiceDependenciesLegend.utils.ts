import type { UseStringsReturn } from 'framework/strings'

export const getServicesStates = (
  getString: UseStringsReturn['getString']
): { label: string; identifier: string; color: string }[] => {
  return [
    {
      label: getString('cv.monitoredServices.serviceHealth.serviceDependencies.states.unhealthy'),
      identifier: 'unhealthy',
      color: 'var(--red-500)'
    },
    {
      label: getString('cv.monitoredServices.serviceHealth.serviceDependencies.states.needsAttention'),
      identifier: 'needsAttention',
      color: 'var(--orange-500)'
    },
    {
      label: getString('cv.monitoredServices.serviceHealth.serviceDependencies.states.observe'),
      identifier: 'observe',
      color: 'var(--yellow-600)'
    },
    {
      label: getString('cv.monitoredServices.serviceHealth.serviceDependencies.states.healthy'),
      identifier: 'healthy',
      color: 'var(--green-500)'
    },
    {
      label: getString('na'),
      identifier: 'na',
      color: 'var(--grey-400)'
    }
  ]
}
