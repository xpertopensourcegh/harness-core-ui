import React from 'react'
import type { FormikProps } from 'formik'
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor'
import cx from 'classnames'
import {
  FormInput,
  getMultiTypeFromValue,
  MultiTypeInputType,
  SelectOption,
  ExpressionInput,
  Button
} from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import { useStrings } from 'framework/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'

import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'
import type { ShellScriptFormData } from './shellScriptTypes'

import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'
import css from './ShellScript.module.scss'

export const shellScriptType: SelectOption[] = [
  { label: 'Bash', value: 'Bash' },
  { label: 'PowerShell', value: 'PowerShell' }
]

const langMap: Record<string, string> = {
  Bash: 'shell',
  PowerShell: 'powershell'
}

export default function BaseShellScript(props: { formik: FormikProps<ShellScriptFormData> }): React.ReactElement {
  const {
    formik: { values: formValues, setFieldValue }
  } = props
  const [isFullScreen, setFullScreen] = React.useState(false)

  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()
  const scriptType: string = formValues.spec?.shell || 'Bash'
  const monaco = (
    <div className={css.monacoWrapper}>
      {isFullScreen ? null : (
        <Button
          className={css.expandBtn}
          icon="fullscreen"
          small
          onClick={() => setFullScreen(true)}
          iconProps={{ size: 10 }}
        />
      )}
      <MonacoEditor
        height={isFullScreen ? '70vh' : 300}
        value={formValues?.spec?.source?.spec?.script || ''}
        language={langMap[scriptType] as string}
        options={
          {
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 13,
            minimap: {
              enabled: false
            }
          } as MonacoEditorProps['options']
        }
        onChange={value => setFieldValue('spec.source.spec.script', value)}
      />
    </div>
  )

  return (
    <>
      <div className={cx(stepCss.formGroup, stepCss.md)}>
        <FormInput.InputWithIdentifier inputLabel={getString('pipelineSteps.stepNameLabel')} />
      </div>
      <div className={cx(stepCss.formGroup, stepCss.sm)}>
        <FormInput.Select
          items={shellScriptType}
          name="spec.shell"
          label={getString('scriptType')}
          placeholder={getString('scriptType')}
          disabled
        />
      </div>
      <div className={stepCss.formGroup}>
        <MultiTypeFieldSelector
          name="spec.source.spec.script"
          label={getString('script')}
          defaultValueToReset=""
          allowedTypes={[MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]}
          expressionRender={() => {
            return (
              <ExpressionInput
                value={formValues?.spec?.source?.spec?.script || ''}
                name="spec.source.spec.script"
                onChange={value => setFieldValue('spec.source.spec.script', value)}
              />
            )
          }}
        >
          {isFullScreen ? <div className={css.monacoWrapper} /> : monaco}
        </MultiTypeFieldSelector>
        {getMultiTypeFromValue(formValues.spec.source?.spec?.script) === MultiTypeInputType.RUNTIME && (
          <ConfigureOptions
            value={formValues.spec.source?.spec?.script as string}
            type="String"
            variableName="spec.source.spec.script"
            showRequiredField={false}
            showDefaultField={false}
            showAdvanced={true}
            onChange={value => setFieldValue('spec.source.spec.script', value)}
          />
        )}
      </div>
      <div className={cx(stepCss.formGroup, stepCss.sm)}>
        <FormMultiTypeDurationField
          name="timeout"
          label={getString('pipelineSteps.timeoutLabel')}
          multiTypeDurationProps={{ enableConfigureOptions: false, expressions }}
          className={stepCss.duration}
        />
        {getMultiTypeFromValue(formValues?.timeout) === MultiTypeInputType.RUNTIME && (
          <ConfigureOptions
            value={formValues.spec?.timeout as string}
            type="String"
            variableName="step.timeout"
            showRequiredField={false}
            showDefaultField={false}
            showAdvanced={true}
            onChange={value => {
              setFieldValue('timeout', value)
            }}
          />
        )}
      </div>
      <Dialog
        lazy
        isOpen={isFullScreen}
        isCloseButtonShown
        canOutsideClickClose={false}
        onClose={() => setFullScreen(false)}
        title={`${getString('script')} (${scriptType})`}
        className={css.monacoDialog}
      >
        <div className={Classes.DIALOG_BODY}>{monaco}</div>
      </Dialog>
    </>
  )
}
