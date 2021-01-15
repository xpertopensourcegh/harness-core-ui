import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type {
  MultiTypeMapType,
  MultiTypeMapUIType,
  MultiTypeListType,
  MultiTypeListUIType,
  MultiTypeConnectorRef,
  Resources
} from '../StepsTypes'
import { ECRStepBaseWithRef } from './ECRStepBase'
import { ECRStepInputSet } from './ECRStepInputSet'

export interface ECRStepSpec {
  connectorRef: string
  region: string
  account: string
  imageName: string
  tags: MultiTypeListType
  dockerfile?: string
  context?: string
  labels?: MultiTypeMapType
  buildArgs?: MultiTypeMapType
  target?: string
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface ECRStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: ECRStepSpec
}

export interface ECRStepSpecUI
  extends Omit<ECRStepSpec, 'connectorRef' | 'tags' | 'labels' | 'buildArgs' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  tags: MultiTypeListUIType
  labels?: MultiTypeMapUIType
  buildArgs?: MultiTypeMapUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface ECRStepDataUI extends Omit<ECRStepData, 'spec'> {
  spec: ECRStepSpecUI
}

export interface ECRStepProps {
  initialValues: ECRStepData
  template?: ECRStepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: ECRStepData) => void
}

export class ECRStep extends PipelineStep<ECRStepData> {
  protected type = StepType.ECR
  protected stepName = 'Build and Push to ECR'
  protected stepIcon: IconName = 'ecr-step'
  protected stepPaletteVisible = false

  protected defaultValues: ECRStepData = {
    identifier: '',
    type: StepType.ECR as string,
    spec: {
      connectorRef: '',
      region: '',
      account: '',
      imageName: '',
      tags: []
    }
  }

  validateInputSet(data: ECRStepData, template?: ECRStepData, getString?: UseStringsReturn['getString']): object {
    const errors = {} as any

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.connectorRef) &&
      getMultiTypeFromValue(template?.spec?.connectorRef) === MultiTypeInputType.RUNTIME
    ) {
      set(
        errors,
        'spec.connectorRef',
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.awsConnectorLabel') })
      )
    }

    /* istanbul ignore else */
    if (isEmpty(data?.spec?.region) && getMultiTypeFromValue(template?.spec?.region) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.region', getString?.('fieldRequired', { field: getString?.('pipelineSteps.regionLabel') }))
    }

    /* istanbul ignore else */
    if (isEmpty(data?.spec?.account) && getMultiTypeFromValue(template?.spec?.account) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.account', getString?.('fieldRequired', { field: getString?.('pipelineSteps.accountLabel') }))
    }

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.imageName) &&
      getMultiTypeFromValue(template?.spec?.imageName) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'spec.imageName', getString?.('fieldRequired', { field: getString?.('imageNameLabel') }))
    }

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.tags) &&
      getMultiTypeFromValue(template?.spec?.tags as string) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'spec.tags', getString?.('fieldRequired', { field: getString?.('tagsLabel') }))
    }

    return errors
  }

  renderStep(props: StepProps<ECRStepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <ECRStepInputSet
          initialValues={initialValues}
          template={inputSetData?.template}
          path={inputSetData?.path || ''}
          readonly={!!inputSetData?.readonly}
          stepViewType={stepViewType}
          onUpdate={onUpdate}
        />
      )
    }

    return (
      <ECRStepBaseWithRef
        initialValues={initialValues}
        stepViewType={stepViewType}
        onUpdate={onUpdate}
        ref={formikRef}
      />
    )
  }
}
