import type { VerifyStepSummary } from 'services/cv'

export interface EventData {
  startTime: number
  name: string
  verificationResult: VerifyStepSummary['verificationStatus']
  headerLabels?: {
    primary?: string
    secondary?: string
  }
  [x: string]: any
}
