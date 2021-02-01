import React from 'react'
import type { IconName } from '@wings-software/uicore'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import { StepViewType } from '@pipeline/exports'
import type { UseStringsReturn } from 'framework/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import { validateInputSet } from '../StepsValidateUtils'
import type {
  MultiTypeMapType,
  MultiTypeMapUIType,
  MultiTypeListType,
  MultiTypeListUIType,
  MultiTypeConnectorRef,
  Resources
} from '../StepsTypes'
import { RunStepBaseWithRef } from './RunStepBase'
import { RunStepInputSet } from './RunStepInputSet'
import { RunStepVariables, RunStepVariablesProps } from './RunStepVariables'
import { inputSetViewValidateFieldsConfig } from './RunStepFunctionConfigs'

export interface RunStepSpec {
  connectorRef: string
  image: string
  command: string
  reports?: {
    type: 'JUnit'
    spec: {
      paths: MultiTypeListType
    }
  }
  envVariables?: MultiTypeMapType
  outputVariables?: MultiTypeListType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface RunStepData {
  identifier: string
  name?: string
  description?: string
  type: string
  timeout?: string
  spec: RunStepSpec
}

export interface RunStepSpecUI
  extends Omit<RunStepSpec, 'connectorRef' | 'paths' | 'envVariables' | 'outputVariables' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  paths?: MultiTypeListUIType
  envVariables?: MultiTypeMapUIType
  outputVariables?: MultiTypeListUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface RunStepDataUI extends Omit<RunStepData, 'spec'> {
  spec: RunStepSpecUI
}

export interface RunStepProps {
  initialValues: RunStepData
  template?: RunStepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: RunStepData) => void
}

export class RunStep extends PipelineStep<RunStepData> {
  constructor() {
    super()
    this._hasStepVariables = true
  }

  protected type = StepType.Run
  protected stepName = 'Configure Run Step'
  protected stepIcon: IconName = 'run-step'
  protected stepPaletteVisible = false

  protected defaultValues: RunStepData = {
    identifier: '',
    type: StepType.Run as string,
    spec: {
      connectorRef: '',
      image: '',
      command: ''
    }
  }

  validateInputSet(data: RunStepData, template?: RunStepData, getString?: UseStringsReturn['getString']): object {
    if (getString) {
      return validateInputSet(data, template, inputSetViewValidateFieldsConfig, { getString })
    }

    return {}
  }

  renderStep(props: StepProps<RunStepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef, customStepProps } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <RunStepInputSet
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
        <RunStepVariables
          {...(customStepProps as RunStepVariablesProps)}
          initialValues={initialValues}
          onUpdate={onUpdate}
        />
      )
    }

    return (
      <RunStepBaseWithRef
        initialValues={initialValues}
        stepViewType={stepViewType}
        onUpdate={onUpdate}
        ref={formikRef}
      />
    )
  }
}
