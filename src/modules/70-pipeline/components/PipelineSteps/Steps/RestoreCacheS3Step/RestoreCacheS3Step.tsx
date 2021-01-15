import React from 'react'
import { isEmpty, set } from 'lodash-es'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type { MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { RestoreCacheS3StepBaseWithRef } from './RestoreCacheS3StepBase'
import { RestoreCacheS3StepInputSet } from './RestoreCacheS3StepInputSet'

export interface RestoreCacheS3StepSpec {
  connectorRef: string
  region: string
  bucket: string
  key: string
  endpoint?: string
  target?: string
  resources?: Resources
}

export interface RestoreCacheS3StepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: RestoreCacheS3StepSpec
}

export interface RestoreCacheS3StepSpecUI extends Omit<RestoreCacheS3StepSpec, 'connectorRef' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface RestoreCacheS3StepDataUI extends Omit<RestoreCacheS3StepData, 'spec'> {
  spec: RestoreCacheS3StepSpecUI
}

export interface RestoreCacheS3StepProps {
  initialValues: RestoreCacheS3StepData
  template?: RestoreCacheS3StepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: RestoreCacheS3StepData) => void
}

export class RestoreCacheS3Step extends PipelineStep<RestoreCacheS3StepData> {
  protected type = StepType.RestoreCacheS3
  protected stepName = 'Restore Cache from S3'
  protected stepIcon: IconName = 'restore-cache-s3'
  protected stepPaletteVisible = false

  protected defaultValues: RestoreCacheS3StepData = {
    identifier: '',
    type: StepType.RestoreCacheS3 as string,
    spec: {
      connectorRef: '',
      region: '',
      bucket: '',
      key: ''
    }
  }

  validateInputSet(
    data: RestoreCacheS3StepData,
    template?: RestoreCacheS3StepData,
    getString?: UseStringsReturn['getString']
  ): object {
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
    if (isEmpty(data?.spec?.key) && getMultiTypeFromValue(template?.spec?.key) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.key', getString?.('fieldRequired', { field: getString?.('keyLabel') }))
    }

    return errors
  }
  renderStep(props: StepProps<RestoreCacheS3StepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <RestoreCacheS3StepInputSet
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
      <RestoreCacheS3StepBaseWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }
}
