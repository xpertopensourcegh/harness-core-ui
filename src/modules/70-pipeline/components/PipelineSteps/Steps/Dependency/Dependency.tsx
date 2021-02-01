import React from 'react'
import type { IconName } from '@wings-software/uicore'
import { StepViewType } from '@pipeline/exports'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import { validateInputSet } from '../StepsValidateUtils'
import type {
  MultiTypeMapType,
  MultiTypeMapUIType,
  MultiTypeListType,
  MultiTypeConnectorRef,
  Resources,
  MultiTypeListUIType
} from '../StepsTypes'
import { DependencyBase } from './DependencyBase'
import { DependencyInputSet } from './DependencyInputSet'
import { DependencyVariables, DependencyVariablesProps } from './DependencyVariables'
import { inputSetViewValidateFieldsConfig } from './DependencyFunctionConfigs'

export interface DependencySpec {
  connectorRef: string
  image: string
  envVariables?: MultiTypeMapType
  entrypoint?: MultiTypeListType
  args?: MultiTypeListType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface DependencyData {
  identifier: string
  name?: string
  description?: string
  type: string
  spec: DependencySpec
}

export interface DependencySpecUI
  extends Omit<DependencySpec, 'connectorRef' | 'envVariables' | 'entrypoint' | 'args' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  envVariables?: MultiTypeMapUIType
  entrypoint?: MultiTypeListUIType
  args?: MultiTypeListUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface DependencyDataUI extends Omit<DependencyData, 'spec'> {
  spec: DependencySpecUI
}

export interface DependencyProps {
  initialValues: DependencyData
  template?: DependencyData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: DependencyData) => void
}

export class Dependency extends PipelineStep<DependencyData> {
  constructor() {
    super()
    this._hasStepVariables = true
  }

  protected type = StepType.Dependency
  protected stepName = 'Configure Service Dependency'
  protected stepIcon: IconName = 'dependency-step'
  protected stepPaletteVisible = false

  protected defaultValues: DependencyData = {
    identifier: '',
    type: StepType.Dependency as string,
    spec: {
      connectorRef: '',
      image: ''
    }
  }

  validateInputSet(data: DependencyData, template?: DependencyData, getString?: UseStringsReturn['getString']): object {
    if (getString) {
      return validateInputSet(data, template, inputSetViewValidateFieldsConfig, { getString })
    }

    return {}
  }

  renderStep(props: StepProps<DependencyData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, customStepProps } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <DependencyInputSet
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
        <DependencyVariables
          {...(customStepProps as DependencyVariablesProps)}
          initialValues={initialValues}
          onUpdate={onUpdate}
        />
      )
    }

    return <DependencyBase initialValues={initialValues} stepViewType={stepViewType} onUpdate={onUpdate} />
  }
}
