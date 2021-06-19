import type { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import type { ExecutionWrapper, StepWhenCondition } from 'services/cd-ng'
import type { StageType } from '@pipeline/utils/stageHelpers'

export enum AdvancedPanels {
  PreRequisites = 'preRequisites',
  FailureStrategy = 'failureStrategy',
  DelegateSelectors = 'delegateSelectors',
  ConditionalExecution = 'conditionalExecution'
}

export interface StepCommandsProps {
  step: ExecutionWrapper
  onChange: (step: ExecutionWrapper) => void
  stepsFactory: AbstractStepFactory
  isStepGroup: boolean
  isReadonly: boolean
  isNewStep?: boolean
  hasStepGroupAncestor?: boolean
  hiddenPanels?: AdvancedPanels[]
  withoutTabs?: boolean
  stageType?: StageType
}

export enum TabTypes {
  StepConfiguration = 'STEP_CONFIGURATION',
  Advanced = 'ADVANCED'
}

export interface Values {
  tab?: TabTypes
  skipCondition?: string
  shouldKeepOpen?: boolean
  failureStrategies?: any[]
  delegateSelectors?: string[]
  when?: StepWhenCondition
}
