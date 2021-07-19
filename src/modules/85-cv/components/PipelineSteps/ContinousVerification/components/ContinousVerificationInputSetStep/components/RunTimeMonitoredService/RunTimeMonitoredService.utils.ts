import type { ContinousVerificationData } from '@cv/components/PipelineSteps/ContinousVerification/types'
import type { MonitoredServiceResponse, HealthSource } from 'services/cv'

export const updateMonitoredServiceData = (
  initialValues: ContinousVerificationData,
  onUpdate?: (data: any) => void,
  monitoredServiceData?: MonitoredServiceResponse
): void => {
  const healthSources =
    monitoredServiceData?.monitoredService?.sources?.healthSources?.map(el => {
      return { identifier: (el as HealthSource)?.identifier }
    }) || []

  const newMonitoredServiceData = {
    monitoredServiceRef: monitoredServiceData?.monitoredService?.name,
    healthSources: healthSources as { identifier: string }[]
  }

  onUpdate?.({
    ...initialValues,
    spec: {
      ...initialValues?.spec,
      ...newMonitoredServiceData,
      spec: { ...initialValues.spec.spec }
    }
  })
}
