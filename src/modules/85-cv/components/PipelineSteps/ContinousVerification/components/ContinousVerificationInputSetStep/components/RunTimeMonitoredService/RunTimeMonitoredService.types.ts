import type { ContinousVerificationData } from '@cv/components/PipelineSteps/ContinousVerification/types'
import type { Sources } from 'services/cv'
export interface RunTimeMonitoredServiceProps {
  serviceIdentifier: string
  envIdentifier: string
  onUpdate?: (data: ContinousVerificationData) => void
  initialValues: ContinousVerificationData
  prefix: string
}
export interface MonitoringSourceData {
  monitoredService: {
    identifier: string
    name: string
    sources: Sources
  }
}
