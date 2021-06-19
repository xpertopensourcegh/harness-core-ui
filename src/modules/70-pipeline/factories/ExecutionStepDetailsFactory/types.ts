import type { StageType } from '@pipeline/utils/stageHelpers'
import type { ExecutionNode } from 'services/pipeline-ng'

export interface StepDetailProps {
  step: ExecutionNode
  stageType?: StageType
}

export interface StepDetailsRegister {
  component: React.ComponentType<StepDetailProps>
}
