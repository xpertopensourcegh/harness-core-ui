import moment from 'moment'
import type { ChangeEventMetadata } from 'services/cv'

export const createK8ChangeInfoData = (metadata: ChangeEventMetadata | undefined) => {
  const { triggeredAt = 0, workload, namespace, kind, reason } = metadata || {}
  return {
    triggerAt: moment(new Date(triggeredAt * 1000)).format('Do MMM hh:mm A'),
    summary: {
      workload,
      namespace,
      kind,
      reason
    }
  }
}
