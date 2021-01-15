import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import { SaveCacheS3StepBaseWithRef } from './SaveCacheS3StepBase'
import { SaveCacheS3StepInputSet } from './SaveCacheS3StepInputSet'
import type { MultiTypeListType, MultiTypeListUIType, MultiTypeConnectorRef, Resources } from '../StepsTypes'

export interface SaveCacheS3StepSpec {
  connectorRef: string
  region: string
  bucket: string
  key: string
  sourcePaths: MultiTypeListType
  endpoint?: string
  target?: string
  resources?: Resources
}

export interface SaveCacheS3StepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: SaveCacheS3StepSpec
}

export interface SaveCacheS3StepSpecUI
  extends Omit<SaveCacheS3StepSpec, 'connectorRef' | 'sourcePaths' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  sourcePaths: MultiTypeListUIType
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface SaveCacheS3StepDataUI extends Omit<SaveCacheS3StepData, 'spec'> {
  spec: SaveCacheS3StepSpecUI
}

export interface SaveCacheS3StepProps {
  initialValues: SaveCacheS3StepData
  template?: SaveCacheS3StepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: SaveCacheS3StepData) => void
}
export class SaveCacheS3Step extends PipelineStep<SaveCacheS3StepData> {
  protected type = StepType.SaveCacheS3
  protected stepName = 'Save Cache to S3'
  protected stepIcon: IconName = 'save-cache-s3'
  protected stepPaletteVisible = false

  protected defaultValues: SaveCacheS3StepData = {
    identifier: '',
    type: StepType.SaveCacheS3 as string,
    spec: {
      connectorRef: '',
      region: '',
      bucket: '',
      key: '',
      sourcePaths: []
    }
  }
  validateInputSet(
    data: SaveCacheS3StepData,
    template?: SaveCacheS3StepData,
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
  renderStep(props: StepProps<SaveCacheS3StepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <SaveCacheS3StepInputSet
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
      <SaveCacheS3StepBaseWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }
}
