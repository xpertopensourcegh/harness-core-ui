import React from 'react'
import { IconName, Text, Formik, FormInput, Button } from '@wings-software/uikit'
import * as Yup from 'yup'
import type { StepViewType } from 'modules/pipeline/exports'
import type { StepGroupElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './StepGroupStep.i18n'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

interface StepGroupWidgetProps {
  initialValues: StepGroupElement
  onUpdate?: (data: StepGroupElement) => void
  stepViewType?: StepViewType
}

const StepGroupWidget: React.FC<StepGroupWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  return (
    <>
      <Text className={stepCss.boldLabel} font={{ size: 'medium' }}>
        {i18n.stepGroup}
      </Text>
      <Formik<StepGroupElement>
        onSubmit={values => {
          onUpdate?.(values)
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

export class StepGroupStep extends PipelineStep<StepGroupElement> {
  renderStep(
    initialValues: StepGroupElement,
    onUpdate?: (data: StepGroupElement) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <StepGroupWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.StepGroup
  protected stepName = i18n.stepGroup
  protected stepIcon: IconName = 'step-group'
  protected stepPaletteVisible = false

  protected defaultValues: StepGroupElement = {
    identifier: '',
    steps: []
  }
}
