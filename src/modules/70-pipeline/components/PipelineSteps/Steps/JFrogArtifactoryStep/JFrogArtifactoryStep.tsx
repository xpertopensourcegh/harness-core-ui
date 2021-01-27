import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type { MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { JFrogArtifactoryStepBaseWithRef } from './JFrogArtifactoryStepBase'
import { JFrogArtifactoryStepInputSet } from './JFrogArtifactoryStepInputSet'
import { JFrogArtifactoryStepVariables, JFrogArtifactoryStepVariablesProps } from './JFrogArtifactoryStepVariables'

export interface JFrogArtifactoryStepSpec {
  connectorRef: string
  target: string
  sourcePath: string
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface JFrogArtifactoryStepData {
  identifier: string
  name?: string
  description?: string
  type: string
  timeout?: string
  spec: JFrogArtifactoryStepSpec
}

export interface JFrogArtifactoryStepSpecUI
  extends Omit<JFrogArtifactoryStepSpec, 'connectorRef' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface JFrogArtifactoryStepDataUI extends Omit<JFrogArtifactoryStepData, 'spec'> {
  spec: JFrogArtifactoryStepSpecUI
}

export interface JFrogArtifactoryStepProps {
  initialValues: JFrogArtifactoryStepData
  template?: JFrogArtifactoryStepData
  path?: string
  readonly?: boolean
  stepViewType?: StepViewType
  onUpdate?: (data: JFrogArtifactoryStepData) => void
}

export class JFrogArtifactoryStep extends PipelineStep<JFrogArtifactoryStepData> {
  constructor() {
    super()
    this._hasStepVariables = true
  }

  protected type = StepType.JFrogArtifactory
  protected stepName = 'Upload Artifacts to JFrog Artifactory'
  protected stepIcon: IconName = 'service-artifactory'
  protected stepPaletteVisible = false

  protected defaultValues: JFrogArtifactoryStepData = {
    identifier: '',
    type: StepType.JFrogArtifactory as string,
    spec: {
      connectorRef: '',
      target: '',
      sourcePath: ''
    }
  }

  validateInputSet(
    data: JFrogArtifactoryStepData,
    template?: JFrogArtifactoryStepData,
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
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.connectorLabel') })
      )
    }

    /* istanbul ignore else */
    if (isEmpty(data?.spec?.target) && getMultiTypeFromValue(template?.spec?.target) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.target', getString?.('fieldRequired', { field: getString?.('pipelineSteps.targetLabel') }))
    }

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.sourcePath) &&
      getMultiTypeFromValue(template?.spec?.sourcePath) === MultiTypeInputType.RUNTIME
    ) {
      set(
        errors,
        'spec.sourcePath',
        getString?.('fieldRequired', { field: getString?.('pipelineSteps.sourcePathLabel') })
      )
    }

    return errors
  }

  renderStep(props: StepProps<JFrogArtifactoryStepData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef, customStepProps } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <JFrogArtifactoryStepInputSet
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
        <JFrogArtifactoryStepVariables
          {...(customStepProps as JFrogArtifactoryStepVariablesProps)}
          initialValues={initialValues}
          onUpdate={onUpdate}
        />
      )
    }

    return (
      <JFrogArtifactoryStepBaseWithRef
        initialValues={initialValues}
        stepViewType={stepViewType}
        onUpdate={onUpdate}
        ref={formikRef}
      />
    )
  }
}
