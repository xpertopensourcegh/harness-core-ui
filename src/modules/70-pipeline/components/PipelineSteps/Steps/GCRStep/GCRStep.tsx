import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { InputSetData } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type {
  MultiTypeMapType,
  MultiTypeMapUIType,
  MultiTypeListType,
  MultiTypeListUIType,
  MultiTypeConnectorRef,
  Resources
} from '../StepsTypes'
import { GCRStepBase } from './GCRStepBase'
import { GCRStepInputSet } from './GCRStepInputSet'

export interface GCRStepSpec {
  connectorRef: string
  host: string
  projectID: string
  imageName: string
  tags: MultiTypeListType
  dockerfile?: string
  context?: string
  labels?: MultiTypeMapType
  buildArgs?: MultiTypeMapType
  target?: string
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface GCRStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: GCRStepSpec
}

export interface GCRStepSpecUI
  extends Omit<GCRStepSpec, 'connectorRef' | 'tags' | 'labels' | 'buildArgs' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  tags: MultiTypeListUIType
  labels?: MultiTypeMapUIType
  buildArgs?: MultiTypeMapUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface GCRStepDataUI extends Omit<GCRStepData, 'spec'> {
  spec: GCRStepSpecUI
}

export interface GCRStepProps {
  initialValues: GCRStepData
  template?: GCRStepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: GCRStepData) => void
}

export class GCRStep extends PipelineStep<GCRStepData> {
  protected type = StepType.GCR
  protected stepName = 'Build and Push to GCR'
  protected stepIcon: IconName = 'gcr-step'
  protected stepPaletteVisible = false

  protected defaultValues: GCRStepData = {
    identifier: '',
    type: StepType.GCR as string,
    spec: {
      connectorRef: '',
      host: '',
      projectID: '',
      imageName: '',
      tags: []
    }
  }

  validateInputSet(data: GCRStepData, template?: GCRStepData, getString?: UseStringsReturn['getString']): object {
    const errors = {} as any

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.connectorRef) &&
      getMultiTypeFromValue(template?.spec?.connectorRef) === MultiTypeInputType.RUNTIME
    ) {
      set(
        errors,
        'spec.connectorRef',
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.gcpConnectorLabel') })
      )
    }

    /* istanbul ignore else */
    if (isEmpty(data?.spec?.host) && getMultiTypeFromValue(template?.spec?.host) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.host', getString?.('fieldRequired', { field: getString?.('pipelineSteps.hostLabel') }))
    }

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.projectID) &&
      getMultiTypeFromValue(template?.spec?.projectID) === MultiTypeInputType.RUNTIME
    ) {
      set(
        errors,
        'spec.projectID',
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.projectIDLabel') })
      )
    }

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.imageName) &&
      getMultiTypeFromValue(template?.spec?.imageName) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'spec.imageName', getString?.('fieldRequired', { field: getString?.('imageNameLabel') }))
    }

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.tags) &&
      getMultiTypeFromValue(template?.spec?.tags as string) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'spec.tags', getString?.('fieldRequired', { field: getString?.('tagsLabel') }))
    }

    return errors
  }

  renderStep(
    initialValues: GCRStepData,
    onUpdate?: (data: GCRStepData) => void,
    stepViewType?: StepViewType,
    inputSetData?: InputSetData<GCRStepData>
  ): JSX.Element {
    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <GCRStepInputSet
          initialValues={initialValues}
          template={inputSetData?.template}
          path={inputSetData?.path || ''}
          readonly={!!inputSetData?.readonly}
          stepViewType={stepViewType}
          onUpdate={onUpdate}
        />
      )
    }

    return <GCRStepBase initialValues={initialValues} stepViewType={stepViewType} onUpdate={onUpdate} />
  }
}
