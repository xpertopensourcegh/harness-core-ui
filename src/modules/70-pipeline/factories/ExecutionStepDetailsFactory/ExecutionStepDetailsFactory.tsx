import type { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { StepDetailsRegister } from './types'

export class ExecutionStepDetailsFactory {
  private stepMap = new Map<StepType, StepDetailsRegister>()
  private defaultRegister: StepDetailsRegister

  constructor(defaultRegister: StepDetailsRegister) {
    this.defaultRegister = defaultRegister
  }

  registerStepDetails(stepType: StepType, stepDetails: StepDetailsRegister): void {
    if (this.stepMap.has(stepType)) {
      throw new Error(`Step of type "${stepType}" is already registred`)
    }

    this.stepMap.set(stepType, stepDetails)
  }

  getStepDetails(stepType?: StepType): StepDetailsRegister {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return stepType && this.stepMap.has(stepType) ? this.stepMap.get(stepType)! : this.defaultRegister
  }
}
