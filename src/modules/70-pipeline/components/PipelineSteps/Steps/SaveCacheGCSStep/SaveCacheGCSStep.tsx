import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { InputSetData } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type { MultiTypeListType, MultiTypeListUIType, MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { SaveCacheGCSStepBase } from './SaveCacheGCSStepBase'
import { SaveCacheGCSStepInputSet } from './SaveCacheGCSStepInputSet'

export interface SaveCacheGCSStepSpec {
  connectorRef: string
  bucket: string
  key: string
  sourcePaths: MultiTypeListType
  target?: string
  resources?: Resources
}

export interface SaveCacheGCSStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: SaveCacheGCSStepSpec
}

export interface SaveCacheGCSStepSpecUI
  extends Omit<SaveCacheGCSStepSpec, 'connectorRef' | 'sourcePaths' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  sourcePaths: MultiTypeListUIType
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface SaveCacheGCSStepDataUI extends Omit<SaveCacheGCSStepData, 'spec'> {
  spec: SaveCacheGCSStepSpecUI
}

export interface SaveCacheGCSStepProps {
  initialValues: SaveCacheGCSStepData
  template?: SaveCacheGCSStepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: SaveCacheGCSStepData) => void
}

export class SaveCacheGCSStep extends PipelineStep<SaveCacheGCSStepData> {
  protected type = StepType.SaveCacheGCS
  protected stepName = 'Save Cache to GCS'
  protected stepIcon: IconName = 'save-cache-gcs'
  protected stepPaletteVisible = false

  protected defaultValues: SaveCacheGCSStepData = {
    identifier: '',
    type: StepType.SaveCacheGCS as string,
    spec: {
      connectorRef: '',
      bucket: '',
      key: '',
      sourcePaths: []
    }
  }

  validateInputSet(
    data: SaveCacheGCSStepData,
    template?: SaveCacheGCSStepData,
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

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.sourcePaths) &&
      getMultiTypeFromValue(template?.spec?.sourcePaths as string) === MultiTypeInputType.RUNTIME
    ) {
      set(
        errors,
        'spec.sourcePaths',
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.sourcePathsLabel') })
      )
    }

    return errors
  }
  renderStep(
    initialValues: SaveCacheGCSStepData,
    onUpdate?: (data: SaveCacheGCSStepData) => void,
    stepViewType?: StepViewType,
    inputSetData?: InputSetData<SaveCacheGCSStepData>
  ): JSX.Element {
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <SaveCacheGCSStepInputSet
          initialValues={initialValues}
          template={inputSetData?.template}
          path={inputSetData?.path || ''}
          readonly={!!inputSetData?.readonly}
          stepViewType={stepViewType}
          onUpdate={onUpdate}
        />
      )
    }
    return <SaveCacheGCSStepBase initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
}
