import type { IconName } from '@wings-software/uicore'
import type { StageElementWrapper } from 'services/cd-ng'

export enum ApprovalType {
  HARNESS = 'HARNESS',
  JIRA = 'JIRA',
  SERVICENOW = 'SERVICENOW'
}

export interface ApprovalStageMinimalModeProps {
  data?: StageElementWrapper
  onSubmit?: (values: StageElementWrapper, identifier: string) => void
  onChange?: (values: StageElementWrapper) => void
}

export interface ApprovalStageMinimalValues {
  identifier: string
  name: string
  description?: string
  approvalType: ApprovalType
}

export interface ApprovalCardsViewData {
  text: string
  value: string
  icon: IconName
  disabled?: boolean
}

export interface ApprovalStageOverviewProps {
  name?: string
}

export interface ApprovalStageExecutionProps {
  name?: string
}
