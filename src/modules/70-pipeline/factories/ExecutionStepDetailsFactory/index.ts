import { DefaultView } from '@pipeline/components/execution/StepDetails/views/DefaultView/DefaultView'
import { ExecutionStepDetailsFactory } from './ExecutionStepDetailsFactory'

const executionStepDetailsFactory = new ExecutionStepDetailsFactory({
  component: DefaultView
})

export default executionStepDetailsFactory
