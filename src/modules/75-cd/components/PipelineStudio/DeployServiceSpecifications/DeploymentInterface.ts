import type { IconName } from '@wings-software/uicore'

export interface DeploymentTypeItem {
  label: string
  icon: IconName
  value: string
  disabled?: boolean
}
