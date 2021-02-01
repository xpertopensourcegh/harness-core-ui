import React from 'react'
import type { IconName } from '@wings-software/uicore'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import { StepViewType } from '@pipeline/exports'
import type { UseStringsReturn } from 'framework/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import { validateInputSet } from '../StepsValidateUtils'
import type { MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { GCSStepBaseWithRef } from './GCSStepBase'
import { GCSStepInputSet } from './GCSStepInputSet'
import { GCSStepVariables, GCSStepVariablesProps } from './GCSStepVariables'
import { inputSetViewValidateFieldsConfig } from './GCSStepFunctionConfigs'

export interface GCSStepSpec {
  connectorRef: string
  bucket: string
  sourcePath: string
  target?: string
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface GCSStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: GCSStepSpec
}

export interface GCSStepSpecUI extends Omit<GCSStepSpec, 'connectorRef' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface GCSStepDataUI extends Omit<GCSStepData, 'spec'> {
  spec: GCSStepSpecUI
}

export interface GCSStepProps {
  initialValues: GCSStepData
  template?: GCSStepData
  path?: string
  readonly?: boolean
  onUpdate?: (data: GCSStepData) => void
  stepViewType?: StepViewType
}

export class GCSStep extends PipelineStep<GCSStepData> {
  constructor() {
    super()
    this._hasStepVariables = true
  }

  protected type = StepType.GCS
  protected stepName = 'Upload Artifacts to GCS'
  protected stepIcon: IconName = 'gcs-step'
  protected stepPaletteVisible = false

  protected defaultValues: GCSStepData = {
    identifier: '',
    type: StepType.GCS as string,
    spec: {
      connectorRef: '',
      bucket: '',
      sourcePath: ''
    }
  }
  validateInputSet(data: GCSStepData, template?: GCSStepData, getString?: UseStringsReturn['getString']): object {
    if (getString) {
      return validateInputSet(data, template, inputSetViewValidateFieldsConfig, { getString })
    }

    return {}
  }
  renderStep(props: StepProps<GCSStepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef, customStepProps } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <GCSStepInputSet
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
        <GCSStepVariables
          {...(customStepProps as GCSStepVariablesProps)}
          initialValues={initialValues}
          onUpdate={onUpdate}
        />
      )
    }

    return (
      <GCSStepBaseWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }
}
