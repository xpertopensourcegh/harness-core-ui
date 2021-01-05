import type { SelectOption } from '@wings-software/uicore'
import type { NotificationMethod } from 'services/cv'

export interface CVNotificationForm {
  uuid?: string
  name?: string
  identifier?: string
  notificationSettingType?: NotificationMethod['notificationSettingType']
  enabledRisk?: boolean
  services?: SelectOption[]
  environments?: SelectOption[]
  threshold?: number
  activityTypes?: SelectOption[]
  verificationStatuses?: SelectOption[]
  webhookUrl?: string
  enabledVerifications?: boolean
  key?: string
  emailIds?: string[]
  allActivityTpe?: boolean
  allVerificationStatuses?: boolean
  allServices?: boolean
  allEnvironments?: boolean
}
