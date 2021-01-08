import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import { StepViewType } from '@pipeline/exports'
import type { InputSetData } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
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
    const errors = {} as any

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.connectorRef) &&
      getMultiTypeFromValue(template?.spec?.connectorRef) === MultiTypeInputType.RUNTIME
    ) {
      set(
        errors,
        'spec.connectorRef',
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.connectorLabel') })
      )
    }

    /* istanbul ignore else */
    if (isEmpty(data?.spec?.image) && getMultiTypeFromValue(template?.spec?.image) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.image', getString?.('fieldRequired', { field: getString?.('imageLabel') }))
    }

    return errors
  }

  renderStep(
    initialValues: DependencyData,
    onUpdate?: (data: DependencyData) => void,
    stepViewType?: StepViewType,
    inputSetData?: InputSetData<DependencyData>
  ): JSX.Element {
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
    }

    return <DependencyBase initialValues={initialValues} stepViewType={stepViewType} onUpdate={onUpdate} />
  }
}
