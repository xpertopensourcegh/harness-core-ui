import React from 'react'
import { getMultiTypeFromValue, MultiTypeInputType, IconName } from '@wings-software/uicore'
import { isEmpty, set } from 'lodash-es'
import type { StepProps } from '@pipeline/components/AbstractSteps/Step'
import type { UseStringsReturn } from 'framework/exports'
import { StepViewType } from '@pipeline/exports'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import type { MultiTypeConnectorRef, Resources } from '../StepsTypes'
import { GCSStepBaseWithRef } from './GCSStepBase'
import { GCSStepInputSet } from './GCSStepInputSet'
import { GCSStepVariables, GCSStepVariablesProps } from './GCSStepVariables'

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
    const errors = {} as any

    /* istanbul ignore else */
    if (
      isEmpty(data?.spec?.connectorRef) &&
      getMultiTypeFromValue(template?.spec?.connectorRef) === MultiTypeInputType.RUNTIME
    ) {
      set(errors, 'spec.connectorRef', getString?.('validation.GCPConnectorRefRequired'))
    }

    /* istanbul ignore else */
    if (isEmpty(data?.spec?.bucket) && getMultiTypeFromValue(template?.spec?.bucket) === MultiTypeInputType.RUNTIME) {
      set(errors, 'spec.bucket', getString?.('fieldRequired', { field: getString?.('pipelineSteps.bucketLabel') }))
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
