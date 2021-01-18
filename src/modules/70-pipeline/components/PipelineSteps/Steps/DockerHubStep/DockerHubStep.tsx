import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import { StepViewType } from '@pipeline/exports'
import type { UseStringsReturn } from 'framework/exports'
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
import { DockerHubStepBaseWithRef } from './DockerHubStepBase'
import { DockerHubStepInputSet } from './DockerHubStepInputSet'

export interface DockerHubStepSpec {
  connectorRef: string
  repo: string
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

export interface DockerHubStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: DockerHubStepSpec
}

export interface DockerHubStepSpecUI
  extends Omit<DockerHubStepSpec, 'connectorRef' | 'tags' | 'labels' | 'buildArgs' | 'pull' | 'resources'> {
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
export interface DockerHubStepDataUI extends Omit<DockerHubStepData, 'spec'> {
  spec: DockerHubStepSpecUI
}

export interface DockerHubStepProps {
  initialValues: DockerHubStepData
  template?: DockerHubStepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: DockerHubStepData) => void
}

export class DockerHubStep extends PipelineStep<DockerHubStepData> {
  protected type = StepType.DockerHub
  protected stepName = 'Build and Publish to Docker Registry'
  protected stepIcon: IconName = 'docker-hub-step'
  protected stepPaletteVisible = false

  protected defaultValues: DockerHubStepData = {
    identifier: '',
    type: StepType.DockerHub as string,
    spec: {
      connectorRef: '',
      repo: '',
      tags: []
    }
  }

  validateInputSet(
    data: DockerHubStepData,
    template?: DockerHubStepData,
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
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.dockerHubConnectorLabel') })
      )
    }

    /* istanbul ignore else */
    if (isEmpty(data?.spec?.repo) && getMultiTypeFromValue(template?.spec?.repo) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.repo', getString?.('fieldRequired', { field: getString?.('repository') }))
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

  renderStep(props: StepProps<DockerHubStepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <DockerHubStepInputSet
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
      <DockerHubStepBaseWithRef
        initialValues={initialValues}
        stepViewType={stepViewType}
        onUpdate={onUpdate}
        ref={formikRef}
      />
    )
  }
}
