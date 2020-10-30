import type { ActivityType } from './ActivitySelectionModal/ActivitySelectionModal'

type ActivityTypeActions = ActivityType | 'register-activity'

const noActivityButtons: Array<{ label: string; value: ActivityTypeActions }> = [
  { label: 'Add Verification Job', value: 'verification-jobs' },
  { label: 'Register Activity', value: 'register-activity' },
  { label: 'Add Activity Sources', value: 'activity-sources' }
]

export default {
  pageTitle: 'ACTIVITIES',
  activitySubTypes: {
    activities: 'Activities',
    activitySources: 'Activity Sources',
    verificationJobs: 'Verification Jobs'
  },
  identifier: 'Identifier',
  jobName: 'Job Name',
  type: 'Type',
  sensitivity: 'Sensitivity',
  duration: 'Duration',
  emptyMessage: 'No verification jobs created yet',
  noActivityButtons
}
