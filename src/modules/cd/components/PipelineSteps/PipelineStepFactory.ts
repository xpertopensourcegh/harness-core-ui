import { AbstractStepFactory } from 'modules/pipeline/exports'
import { HttpStep } from './Steps/HttpStep/HttpStep'
import { K8RolloutDeployStep } from './Steps/K8sRolloutDeployStep/K8sRolloutDeployStep'
import { ShellScriptStep } from './Steps/ShellScriptStep/ShellScriptStep'
import { StepGroupStep } from './Steps/StepGroupStep/StepGroupStep'
import { CustomVariables } from './Steps/CustomVariables/CustomVariables'
import { KubernetesInfraSpec } from './Steps/KubernetesInfraSpec/KubernetesInfraSpec'

class PipelineStepFactory extends AbstractStepFactory {
  protected type = 'pipeline-factory'
}

const factory = new PipelineStepFactory()

factory.registerStep(new HttpStep())
factory.registerStep(new K8RolloutDeployStep())
factory.registerStep(new ShellScriptStep())
factory.registerStep(new StepGroupStep())
factory.registerStep(new CustomVariables())
factory.registerStep(new KubernetesInfraSpec())

export default factory
