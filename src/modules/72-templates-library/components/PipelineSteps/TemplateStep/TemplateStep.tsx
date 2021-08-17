import React from 'react'
import type { FormikErrors } from 'formik'
import type { IconName } from '@wings-software/uicore'
import { StepProps, StepViewType, ValidateInputSetProps } from '@pipeline/components/AbstractSteps/Step'

import { PipelineStep } from '@pipeline/components/PipelineSteps/PipelineStep'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { TemplateStepWidgetWithRef, TemplateStepData } from './TemplateStepWidget'

export class TemplateStep extends PipelineStep<TemplateStepData> {
  constructor() {
    super()
  }

  protected type = StepType.Template
  protected stepName = 'Template step'
  protected stepIcon: IconName = 'library'

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
    const { initialValues, onUpdate, stepViewType, formikRef, isNewStep, readonly, factory } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return <div />
    } else if (stepViewType === StepViewType.InputVariable) {
      return <div />
    }
    return (
      <TemplateStepWidgetWithRef
        ref={formikRef}
        stepViewType={stepViewType}
        initialValues={initialValues}
        onUpdate={(values: TemplateStepData) => onUpdate?.(values)}
        isNewStep={isNewStep}
        readonly={readonly}
        factory={factory}
      />
    )
  }
}
