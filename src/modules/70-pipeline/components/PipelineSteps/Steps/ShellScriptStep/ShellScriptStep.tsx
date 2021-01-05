import React from 'react'
import { IconName, Text, Formik, FormInput, Button } from '@wings-software/uicore'
import * as Yup from 'yup'
import type { StepViewType } from '@pipeline/exports'
import type { ShellScriptStepInfo, StepElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './ShellScriptStep.i18n'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

export interface ShellScriptData extends StepElement {
  spec: ShellScriptStepInfo
}

interface ShellScriptWidgetProps {
  initialValues: ShellScriptData
  onUpdate?: (data: ShellScriptData) => void
  stepViewType?: StepViewType
}

const ShellScriptWidget: React.FC<ShellScriptWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  return (
    <>
      <Text className={stepCss.boldLabel} font={{ size: 'medium' }}>
        {i18n.shellScriptStep}
      </Text>
      <Formik<ShellScriptData>
        onSubmit={values => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(i18n.stepNameRequired)
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

export class ShellScriptStep extends PipelineStep<ShellScriptData> {
  renderStep(
    initialValues: ShellScriptData,
    onUpdate?: (data: ShellScriptData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <ShellScriptWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  validateInputSet(): object {
    return {}
  }
  protected type = StepType.SHELLSCRIPT
  protected stepName = i18n.shellScriptStep
  protected stepIcon: IconName = 'command-shell-script'

  protected defaultValues: ShellScriptData = {
    identifier: '',
    spec: {}
  }
}
