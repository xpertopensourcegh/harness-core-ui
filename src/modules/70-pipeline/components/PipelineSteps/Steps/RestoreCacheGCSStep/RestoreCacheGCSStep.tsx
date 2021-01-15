import React from 'react'
import { isEmpty, set } from 'lodash-es'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type { MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { RestoreCacheGCSStepBaseWithRef } from './RestoreCacheGCSStepBase'
import { RestoreCacheGCSStepInputSet } from './RestoreCacheGCSStepInputSet'

export interface RestoreCacheGCSStepSpec {
  connectorRef: string
  bucket: string
  key: string
  target?: string
  resources?: Resources
}

export interface RestoreCacheGCSStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: RestoreCacheGCSStepSpec
}

export interface RestoreCacheGCSStepSpecUI
  extends Omit<RestoreCacheGCSStepSpec, 'connectorRef' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface RestoreCacheGCSStepDataUI extends Omit<RestoreCacheGCSStepData, 'spec'> {
  spec: RestoreCacheGCSStepSpecUI
}

export interface RestoreCacheGCSStepProps {
  initialValues: RestoreCacheGCSStepData
  template?: RestoreCacheGCSStepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: RestoreCacheGCSStepData) => void
}

export class RestoreCacheGCSStep extends PipelineStep<RestoreCacheGCSStepData> {
  protected type = StepType.RestoreCacheGCS
  protected stepName = 'Restore Cache from GCS'
  protected stepIcon: IconName = 'restore-cache-gcs'
  protected stepPaletteVisible = false

  protected defaultValues: RestoreCacheGCSStepData = {
    identifier: '',
    type: StepType.RestoreCacheGCS as string,
    spec: {
      connectorRef: '',
      bucket: '',
      key: ''
    }
  }
  validateInputSet(
    data: RestoreCacheGCSStepData,
    template?: RestoreCacheGCSStepData,
    getString?: UseStringsReturn['getString']
  ): object {
    const errors = {} as any

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.connectorRef) &&
      getMultiTypeFromValue(template?.spec?.connectorRef) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'spec.connectorRef', getString?.('validation.GCPConnectorRefRequired'))
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
  renderStep(props: StepProps<RestoreCacheGCSStepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <RestoreCacheGCSStepInputSet
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
      <RestoreCacheGCSStepBaseWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }
}
