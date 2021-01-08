import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { InputSetData } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type { MultiTypeMapType, MultiTypeMapUIType, MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { PluginStepBase } from './PluginStepBase'
import { PluginStepInputSet } from './PluginStepInputSet'

export interface PluginStepSpec {
  connectorRef: string
  image: string
  settings?: MultiTypeMapType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface PluginStepData {
  identifier: string
  name?: string
  description?: string
  type: string
  timeout?: string
  spec: PluginStepSpec
}

export interface PluginStepSpecUI extends Omit<PluginStepSpec, 'connectorRef' | 'settings' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  settings?: MultiTypeMapUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface PluginStepDataUI extends Omit<PluginStepData, 'spec'> {
  spec: PluginStepSpecUI
}

export interface PluginStepProps {
  initialValues: PluginStepData
  template?: PluginStepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: PluginStepData) => void
}

export class PluginStep extends PipelineStep<PluginStepData> {
  protected type = StepType.Plugin
  protected stepName = 'Configure Plugin Step'
  protected stepIcon: IconName = 'plugin-step'
  protected stepPaletteVisible = false

  protected defaultValues: PluginStepData = {
    identifier: '',
    type: StepType.Plugin as string,
    spec: {
      connectorRef: '',
      image: '',
      settings: {}
    }
  }

  validateInputSet(data: PluginStepData, template?: PluginStepData, getString?: UseStringsReturn['getString']): object {
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

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.settings) &&
      getMultiTypeFromValue(template?.spec?.settings as string) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'spec.settings', getString?.('fieldRequired', { field: getString?.('pipelineSteps.settingsLabel') }))
    }

    return errors
  }

  renderStep(
    initialValues: PluginStepData,
    onUpdate?: (data: PluginStepData) => void,
    stepViewType?: StepViewType,
    inputSetData?: InputSetData<PluginStepData>
  ): JSX.Element {
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <PluginStepInputSet
          initialValues={initialValues}
          template={inputSetData?.template}
          path={inputSetData?.path || ''}
          readonly={!!inputSetData?.readonly}
          stepViewType={stepViewType}
          onUpdate={onUpdate}
        />
      )
    }

    return <PluginStepBase initialValues={initialValues} stepViewType={stepViewType} onUpdate={onUpdate} />
  }
}
