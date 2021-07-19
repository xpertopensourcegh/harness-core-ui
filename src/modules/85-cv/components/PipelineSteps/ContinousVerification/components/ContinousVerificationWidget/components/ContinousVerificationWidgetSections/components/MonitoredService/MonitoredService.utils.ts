import type { ContinousVerificationData, spec } from '@cv/components/PipelineSteps/ContinousVerification/types'
import type { HealthSource, MonitoredServiceDTO } from 'services/cv'

export const getNewSpecs = (monitoredServiceData: MonitoredServiceDTO, formValues: ContinousVerificationData): spec => {
  const healthSources =
    monitoredServiceData?.sources?.healthSources?.map(el => {
      return { identifier: (el as HealthSource)?.identifier }
    }) || []

  return { ...formValues.spec, monitoredServiceRef: monitoredServiceData?.identifier, healthSources }
}
