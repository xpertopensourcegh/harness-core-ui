import React from 'react'
import { IconName, Text, Formik, FormInput, Button } from '@wings-software/uikit'
import * as Yup from 'yup'
import { Step } from 'modules/common/exports'
import type { StepGroupElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './StepGroupStep.i18n'
import stepCss from '../Steps.module.scss'

interface StepGroupWidgetProps {
  initialValues: StepGroupElement
  onSubmit?: (data: StepGroupElement) => void
  templatedFields?: string[]
}

const StepGroupWidget: React.FC<StepGroupWidgetProps> = ({ initialValues, onSubmit }): JSX.Element => {
  return (
    <>
      <Text className={stepCss.boldLabel} font={{ size: 'medium' }}>
        {i18n.stepGroup}
      </Text>
      <Formik<StepGroupElement>
        onSubmit={values => {
          onSubmit?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(i18n.stageNameRequired)
        })}
      >
        {({ submitForm }) => {
          return (
            <>
              <FormInput.InputWithIdentifier inputLabel={i18n.displayName} />
              <Button intent="primary" text={i18n.submit} onClick={submitForm} />
            </>
          )
        }}
      </Formik>
    </>
  )
}

export class StepGroupStep extends Step<StepGroupElement> {
  renderStep(
    initialValues: StepGroupElement,
    onSubmit?: (data: StepGroupElement) => void,
    templatedFields?: string[]
  ): JSX.Element {
    return <StepGroupWidget initialValues={initialValues} onSubmit={onSubmit} templatedFields={templatedFields} />
  }

  protected type = StepType.StepGroup
  protected stepName = i18n.stepGroup
  protected stepIcon: IconName = 'step-group'

  protected defaultValues: StepGroupElement = {
    identifier: 'step-group',
    steps: []
  }
}
