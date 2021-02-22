import { AbstractStepFactory } from '@pipeline/exports'

import { StepGroupStep } from './Steps/StepGroupStep/StepGroupStep'
import { CustomVariables } from './Steps/CustomVariables/CustomVariables'
import { BarrierStep } from './Steps/Barrier/Barrier'

class PipelineStepFactory extends AbstractStepFactory {
  protected type = 'pipeline-factory'
}

const factory = new PipelineStepFactory()

// common
factory.registerStep(new BarrierStep())
factory.registerStep(new StepGroupStep())
factory.registerStep(new CustomVariables())

// build steps
export default factory
