import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type { MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { S3StepBase } from './S3StepBase'
import { S3StepInputSet } from './S3StepInputSet'

export interface S3StepSpec {
  connectorRef: string
  region: string
  bucket: string
  sourcePath: string
  endpoint?: string
  target?: string
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface S3StepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: S3StepSpec
}

export interface S3StepSpecUI extends Omit<S3StepSpec, 'connectorRef' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface S3StepDataUI extends Omit<S3StepData, 'spec'> {
  spec: S3StepSpecUI
}

export interface S3StepProps {
  initialValues: S3StepData
  template?: S3StepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: S3StepData) => void
}

export class S3Step extends PipelineStep<S3StepData> {
  protected type = StepType.S3
  protected stepName = 'Upload Artifacts to S3'
  protected stepIcon: IconName = 'service-service-s3'
  protected stepPaletteVisible = false

  protected defaultValues: S3StepData = {
    identifier: '',
    type: StepType.S3 as string,
    spec: {
      connectorRef: '',
      region: '',
      bucket: '',
      sourcePath: ''
    }
  }
  validateInputSet(data: S3StepData, template?: S3StepData, getString?: UseStringsReturn['getString']): object {
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
    if (isEmpty(data?.spec?.bucket) && getMultiTypeFromValue(template?.spec?.bucket) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.bucket', getString?.('fieldRequired', { field: getString?.('pipelineSteps.bucketLabel') }))
    }

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.sourcePath) &&
      getMultiTypeFromValue(template?.spec?.sourcePath) === MultiTypeInputType.RUNTIME
    ) {
      set(
        errors,
        'spec.sourcePath',
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.sourcePathLabel') })
      )
    }

    return errors
  }
  renderStep(props: StepProps<S3StepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <S3StepInputSet
          initialValues={initialValues}
          template={inputSetData?.template}
          path={inputSetData?.path || ''}
          readonly={!!inputSetData?.readonly}
          stepViewType={stepViewType}
          onUpdate={onUpdate}
        />
      )
    }
    return <S3StepBase initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
}
