import { AbstractStepFactory } from '@pipeline/exports'
import { HttpStep } from './Steps/HttpStep/HttpStep'
import { K8RolloutDeployStep } from './Steps/K8sRolloutDeployStep/K8sRolloutDeployStep'
import { ShellScriptStep } from './Steps/ShellScriptStep/ShellScriptStep'
import { SaveCache } from './Steps/SaveCache/SaveCache'
import { RestoreCache } from './Steps/RestoreCache/RestoreCache'
import { StepGroupStep } from './Steps/StepGroupStep/StepGroupStep'
import { CustomVariables } from './Steps/CustomVariables/CustomVariables'
import { KubernetesInfraSpec } from './Steps/KubernetesInfraSpec/KubernetesInfraSpec'
import { RedisService } from './Steps/RedisService/RedisService'
import { RunStep } from './Steps/RunStep/RunStep'
import { PluginStep } from './Steps/PluginStep/PluginStep'

class PipelineStepFactory extends AbstractStepFactory {
  protected type = 'pipeline-factory'
}

const factory = new PipelineStepFactory()

// deploy steps
factory.registerStep(new HttpStep())
factory.registerStep(new K8RolloutDeployStep())
factory.registerStep(new ShellScriptStep())
factory.registerStep(new StepGroupStep())
factory.registerStep(new CustomVariables())
factory.registerStep(new KubernetesInfraSpec())
// build steps
factory.registerStep(new SaveCache())
factory.registerStep(new RestoreCache())
factory.registerStep(new RunStep())
factory.registerStep(new PluginStep())
// build services
factory.registerStep(new RedisService())

export default factory
