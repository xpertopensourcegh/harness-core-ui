import React from 'react'
import { IconName, Text, Formik, FormInput, Button } from '@wings-software/uikit'
import * as Yup from 'yup'
import { Step, StepViewType } from 'modules/common/exports'
import type { ShellScriptStepInfo, StepElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './ShellScriptStep.i18n'
import stepCss from '../Steps.module.scss'

export interface ShellScriptData extends Omit<StepElement, 'spec'> {
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

export class ShellScriptStep extends Step<ShellScriptData> {
  renderStep(
    initialValues: ShellScriptData,
    onUpdate?: (data: ShellScriptData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <ShellScriptWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.SHELL_SCRIPT
  protected stepName = i18n.shellScriptStep
  protected stepIcon: IconName = 'command-shell-script'

  protected defaultValues: ShellScriptData = {
    spec: {
      skipDryRun: false,
      timeout: 60000
    }
  }
}
