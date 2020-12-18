import type { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import type { ExecutionWrapper } from 'services/cd-ng'

export interface StepCommandsProps {
  step: ExecutionWrapper
  onChange: (step: ExecutionWrapper) => void
  stepsFactory: AbstractStepFactory
  isStepGroup: boolean
}

export enum TabTypes {
  StepConfiguration = 'STEP_CONFIGURATION',
  Advanced = 'ADVANCED'
}

export interface Values {
  tab?: TabTypes
  skipCondition?: string
  shouldKeepOpen?: boolean
}
