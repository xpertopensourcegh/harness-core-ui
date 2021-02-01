import React from 'react'
import type { IconName } from '@wings-software/uicore'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import { StepViewType } from '@pipeline/exports'
import type { UseStringsReturn } from 'framework/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import { validateInputSet } from '../StepsValidateUtils'
import type { MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { RestoreCacheGCSStepBaseWithRef } from './RestoreCacheGCSStepBase'
import { RestoreCacheGCSStepInputSet } from './RestoreCacheGCSStepInputSet'
import { RestoreCacheGCSStepVariables, RestoreCacheGCSStepVariablesProps } from './RestoreCacheGCSStepVariables'
import { inputSetViewValidateFieldsConfig } from './RestoreCacheGCSStepFunctionConfigs'

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
  constructor() {
    super()
    this._hasStepVariables = true
  }

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
    if (getString) {
      return validateInputSet(data, template, inputSetViewValidateFieldsConfig, { getString })
    }

    return {}
  }

  renderStep(props: StepProps<RestoreCacheGCSStepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef, customStepProps } = props

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
    } else if (stepViewType === StepViewType.InputVariable) {
      return (
        <RestoreCacheGCSStepVariables
          {...(customStepProps as RestoreCacheGCSStepVariablesProps)}
          initialValues={initialValues}
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
