import { AbstractStepFactory } from '@pipeline/exports'
import { HttpStep } from './Steps/HttpStep/HttpStep'
import { K8RolloutDeployStep } from './Steps/K8sRolloutDeployStep/K8sRolloutDeployStep'
import { ShellScriptStep } from './Steps/ShellScriptStep/ShellScriptStep'
import { StepGroupStep } from './Steps/StepGroupStep/StepGroupStep'
import { CustomVariables } from './Steps/CustomVariables/CustomVariables'
import { KubernetesInfraSpec } from './Steps/KubernetesInfraSpec/KubernetesInfraSpec'
import { RunStep } from './Steps/RunStep/RunStep'
import { PluginStep } from './Steps/PluginStep/PluginStep'
import { GCRStep } from './Steps/GCRStep/GCRStep'
import { ECRStep } from './Steps/ECRStep/ECRStep'
import { SaveCacheGCSStep } from './Steps/SaveCacheGCSStep/SaveCacheGCSStep'
import { RestoreCacheGCSStep } from './Steps/RestoreCacheGCSStep/RestoreCacheGCSStep'
import { SaveCacheS3Step } from './Steps/SaveCacheS3Step/SaveCacheS3Step'
import { RestoreCacheS3Step } from './Steps/RestoreCacheS3Step/RestoreCacheS3Step'
import { DockerHubStep } from './Steps/DockerHubStep/DockerHubStep'
import { GCSStep } from './Steps/GCSStep/GCSStep'
import { S3Step } from './Steps/S3Step/S3Step'
import { JFrogArtifactoryStep } from './Steps/JFrogArtifactoryStep/JFrogArtifactoryStep'
import { Dependency } from './Steps/Dependency/Dependency'

import { KubernetesServiceSpec } from './Steps/K8sServiceSpec/K8sServiceSpec'
import { K8sBlueGreenDeployStep } from './Steps/K8sBgStep/K8sBlueGreenDeployStep'
import { K8sCanaryDeployStep } from './Steps/K8sCanaryDeploy/K8sCanaryDeployStep'
import { K8sBGSwapServices } from './Steps/K8sBGSwapServices/K8sBGSwapServices'
import { K8sScaleStep } from './Steps/K8sScale/K8sScaleStep'
import { K8sRollingRollbackStep } from './Steps/K8sRollingRollback/K8sRollingRollback'
import { K8sCanaryDeleteStep } from './Steps/K8sCanaryDelete/K8sCanaryDeleteStep'
import { K8sApplyStep } from './Steps/K8sApply/K8sApplyStep'
import { BarrierStep } from './Steps/Barrier/Barrier'
import { DeployEnvironmentStep } from './Steps/DeployEnvStep/DeployEnvStep'
import { DeployServiceStep } from './Steps/DeployServiceStep/DeployServiceStep'
class PipelineStepFactory extends AbstractStepFactory {
  protected type = 'pipeline-factory'
}

const factory = new PipelineStepFactory()

// deploy steps
factory.registerStep(new HttpStep())
factory.registerStep(new K8RolloutDeployStep())
factory.registerStep(new K8sRollingRollbackStep())
factory.registerStep(new BarrierStep())
factory.registerStep(new K8sBlueGreenDeployStep())
factory.registerStep(new K8sCanaryDeployStep())
factory.registerStep(new K8sBGSwapServices())
factory.registerStep(new K8sScaleStep())
factory.registerStep(new K8sCanaryDeleteStep())
factory.registerStep(new K8sApplyStep())

factory.registerStep(new ShellScriptStep())
factory.registerStep(new StepGroupStep())
factory.registerStep(new CustomVariables())
factory.registerStep(new KubernetesInfraSpec())
factory.registerStep(new DeployEnvironmentStep())
factory.registerStep(new DeployServiceStep())
factory.registerStep(new KubernetesServiceSpec())
// build steps
factory.registerStep(new RunStep())
factory.registerStep(new PluginStep())
factory.registerStep(new GCRStep())
factory.registerStep(new ECRStep())
factory.registerStep(new SaveCacheGCSStep())
factory.registerStep(new RestoreCacheGCSStep())
factory.registerStep(new SaveCacheS3Step())
factory.registerStep(new RestoreCacheS3Step())
factory.registerStep(new DockerHubStep())
factory.registerStep(new GCSStep())
factory.registerStep(new S3Step())
factory.registerStep(new JFrogArtifactoryStep())
factory.registerStep(new Dependency())

export default factory
