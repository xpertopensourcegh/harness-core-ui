import type { ExecutionNode } from 'services/pipeline-ng'

export interface StepDetailProps {
  step: ExecutionNode
}

export interface StepDetailsRegister {
  component: React.ComponentType<StepDetailProps>
}
