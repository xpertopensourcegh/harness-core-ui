import React from 'react'
import { Color, Formik, FormInput, Layout, MultiTypeInputType, Text } from '@wings-software/uicore'
import * as Yup from 'yup'
import cx from 'classnames'
import type { FormikProps } from 'formik'
import { NameSchema } from '@common/utils/Validation'
import { setFormikRef, StepViewType, StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { useStrings } from 'framework/strings'
import { StepWidget } from '@pipeline/components/AbstractSteps/StepWidget'
import type { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import type { StepElementConfig } from 'services/cd-ng'
import type { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { TemplateStepData } from '@pipeline/utils/tempates'
import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

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
  const stepType = initialValues.template.templateInputs.type as StepType

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
              <Layout.Vertical
                margin={{ top: 'medium' }}
                padding={{ top: 'large', bottom: 'large' }}
                border={{ top: true }}
                spacing={'large'}
              >
                <Text style={{ fontSize: 16 }} font={{ weight: 'bold' }} color={Color.BLACK}>
                  {getString('templatesLibrary.templateInputs')}
                </Text>
                <StepWidget<Partial<StepElementConfig>>
                  factory={factory}
                  initialValues={initialValues.template.templateInputs}
                  template={initialValues.template.templateInputs}
                  readonly={readonly}
                  isNewStep={isNewStep}
                  type={stepType}
                  path={'template.templateInputs'}
                  stepViewType={StepViewType.InputSet}
                  allowableTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION, MultiTypeInputType.RUNTIME]}
                />
              </Layout.Vertical>
            </div>
          </React.Fragment>
        )
      }}
    </Formik>
  )
}

export const TemplateStepWidgetWithRef = React.forwardRef(TemplateStepWidget)
