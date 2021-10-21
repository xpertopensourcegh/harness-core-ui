import React from 'react'
import type { FormikErrors } from 'formik'
import type { IconName } from '@wings-software/uicore'
import { StepProps, StepViewType, ValidateInputSetProps } from '@pipeline/components/AbstractSteps/Step'
import { PipelineStep } from '@pipeline/components/PipelineSteps/PipelineStep'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { TemplateStepData } from '@pipeline/utils/tempates'
import TemplateInputSetStep from '@templates-library/components/PipelineSteps/TemplateStep/TemplateInputSetStep'
import { TemplateStepWidgetWithRef } from './TemplateStepWidget/TemplateStepWidget'

export class TemplateStep extends PipelineStep<TemplateStepData> {
  constructor() {
    super()
  }

  protected type = StepType.Template
  protected stepName = 'Template step'
  protected stepIcon: IconName = 'template-library'

  protected defaultValues: TemplateStepData = {
    identifier: '',
    name: '',
    template: {} as any
  }

  validateInputSet({
    data: _data,
    template: _template,
    getString: _getString,
    viewType: _vieweType
  }: ValidateInputSetProps<TemplateStepData>): FormikErrors<TemplateStepData> {
    const errors = {} as any
    return errors
  }

  processFormData(values: TemplateStepData): TemplateStepData {
    return values //processFormData(values)
  }

  renderStep(this: TemplateStep, props: StepProps<TemplateStepData>): JSX.Element {
    const {
      initialValues,
      onUpdate,
      stepViewType,
      formikRef,
      isNewStep,
      readonly,
      factory,
      inputSetData,
      allowableTypes
    } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <TemplateInputSetStep
          initialValues={initialValues}
          onUpdate={data => onUpdate?.(this.processFormData(data))}
          stepViewType={stepViewType}
          readonly={!!inputSetData?.readonly}
          template={inputSetData?.template}
          path={inputSetData?.path || ''}
          allowableTypes={allowableTypes}
        />
      )
    } else if (stepViewType === StepViewType.InputVariable) {
      return <div />
    }
    return (
      <TemplateStepWidgetWithRef
        ref={formikRef}
        stepViewType={stepViewType}
        initialValues={initialValues}
        onUpdate={data => onUpdate?.(this.processFormData(data))}
        isNewStep={isNewStep}
        readonly={readonly}
        factory={factory}
      />
    )
  }
}
