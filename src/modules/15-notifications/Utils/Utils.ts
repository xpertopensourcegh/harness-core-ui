import type { IconName } from '@wings-software/uicore'
import { NotificationType } from '@notifications/interfaces/Notifications'

export const getIconByNotificationMethod = (option: NotificationType): IconName => {
  switch (option) {
    case NotificationType.Email:
      return 'main-email'
    case NotificationType.PagerDuty:
      return 'service-pagerduty'
    case NotificationType.Slack:
      return 'service-slack'
    default:
      return 'main-email'
  }
}
