import type { SelectOption } from '@wings-software/uicore'
import { NotificationType } from './interfaces/Notifications'

export const NotificationTypeSelectOptions: SelectOption[] = [
  {
    label: NotificationType.Slack,
    value: NotificationType.Slack
  },
  {
    label: NotificationType.Email,
    value: NotificationType.Email
  },
  {
    label: NotificationType.PagerDuty,
    value: NotificationType.PagerDuty
  }
]
