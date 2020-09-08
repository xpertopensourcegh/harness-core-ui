import type { IconName } from '@wings-software/uikit'
import { Step, StepViewType } from 'modules/common/exports'
import type { K8SDirectInfrastructure } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './KubernetesInfraSpec.18n'

export class KubernetesInfraSpec extends Step<K8SDirectInfrastructure> {
  protected type = StepType.KubernetesInfraSpec
  protected defaultValues: K8SDirectInfrastructure = {}

  protected stepIcon: IconName = 'service-kubernetes'
  protected stepName: string = i18n.stepName
  renderStep(
    _initialValues: K8SDirectInfrastructure,
    _onUpdate?: ((data: K8SDirectInfrastructure) => void) | undefined,
    _stepViewType?: StepViewType | undefined
  ): JSX.Element {
    throw new Error('Method not implemented.')
  }
}
