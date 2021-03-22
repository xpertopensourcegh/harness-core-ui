import { AbstractStepFactory } from '@pipeline/exports'

import { StepGroupStep } from './Steps/StepGroupStep/StepGroupStep'
import { CustomVariables } from './Steps/CustomVariables/CustomVariables'
import { BarrierStep } from './Steps/Barrier/Barrier'
import { HarnessApproval } from './Steps/Approval/HarnessApproval'

class PipelineStepFactory extends AbstractStepFactory {
  protected type = 'pipeline-factory'
}

const factory = new PipelineStepFactory()

// common
factory.registerStep(new BarrierStep())
factory.registerStep(new StepGroupStep())
factory.registerStep(new CustomVariables())
factory.registerStep(new HarnessApproval())

// build steps
export default factory
