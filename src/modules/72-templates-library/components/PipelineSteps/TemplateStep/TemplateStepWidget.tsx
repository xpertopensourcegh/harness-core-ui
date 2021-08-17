import React from 'react'
import { Formik, FormInput } from '@wings-software/uicore'
import * as Yup from 'yup'
import cx from 'classnames'
import type { FormikProps } from 'formik'

import { NameSchema } from '@common/utils/Validation'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { useStrings } from 'framework/strings'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import type { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import type { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'

import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

export interface TemplateStepData<T = unknown> {
  identifier: string
  name: string
  template: {
    templateRef: string
    templateInputs: {
      type: StepType
      spec: T
    }
  }
}
export interface TemplateStepFormData extends TemplateStepData {
  stepType?: any // TODO: step type
}

export interface TemplateStepWidgetProps {
  initialValues: TemplateStepData //TemplateStepFormData
  isNewStep?: boolean
  isDisabled?: boolean
  onUpdate?: (data: TemplateStepData /*TemplateStepFormData*/) => void
  stepViewType?: StepViewType
  readonly?: boolean
  factory: AbstractStepFactory
}

export function TemplateStepWidget(
  props: TemplateStepWidgetProps,
  formikRef: StepFormikFowardRef<TemplateStepData>
): React.ReactElement {
  const { initialValues, factory, onUpdate, isNewStep, readonly } = props
  const { getString } = useStrings()
  //const { expressions } = useVariablesExpression()
  const stepType = initialValues.template.templateInputs.type
  // const ref = React.useRef<StepFormikRef<unknown> | null>(null)

  return (
    <Formik<TemplateStepData /*TemplateStepFormData*/>
      onSubmit={values => {
        onUpdate?.(values)
      }}
      initialValues={initialValues}
      formName="templateStepWidget"
      validationSchema={Yup.object().shape({
        name: NameSchema({ requiredErrorMsg: getString('pipelineSteps.stepNameRequired') })
      })}
    >
      {(formik: FormikProps<TemplateStepFormData>) => {
        // this is required
        setFormikRef(formikRef, formik)

        return (
          <React.Fragment>
            <div className={stepCss.stepPanel}>
              <div className={cx(stepCss.formGroup, stepCss.md)}>
                <FormInput.InputWithIdentifier
                  isIdentifierEditable={isNewStep && !readonly}
                  inputLabel={getString('name')}
                  inputGroupProps={{ disabled: readonly }}
                />
              </div>
              <hr />
              <StepWidget
                factory={factory}
                initialValues={initialValues.template.templateInputs}
                readonly={readonly}
                isNewStep={isNewStep}
                // onUpdate={onChange}
                type={stepType}
                stepViewType={StepViewType.InputSet}
                inputSetData={{ template: initialValues.template.templateInputs, path: '' }}
              />
            </div>
          </React.Fragment>
        )
      }}
    </Formik>
  )
}

export const TemplateStepWidgetWithRef = React.forwardRef(TemplateStepWidget)
