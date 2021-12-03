import type { IconName } from '@wings-software/uicore'
import type { EventData } from './ActivitiesTimelineView'

export function verificationResultToIcon(verificationResult: EventData['verificationResult']): IconName | undefined {
  switch (verificationResult) {
    case 'VERIFICATION_PASSED':
      return 'deployment-success-legacy'
    case 'VERIFICATION_FAILED':
    case 'ERROR':
      return 'deployment-failed-legacy'
    case 'IN_PROGRESS':
    case 'NOT_STARTED':
      return 'deployment-inprogress-legacy'
    default:
      return undefined
  }
}
