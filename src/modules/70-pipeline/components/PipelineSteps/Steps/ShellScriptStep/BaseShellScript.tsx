import React from 'react'
import type { FormikProps } from 'formik'
import { FormInput, getMultiTypeFromValue, MultiTypeInputType, SelectOption } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import type { ShellScriptStepInfo } from 'services/cd-ng'
import { FormMultiTypeTextAreaField } from '@common/components'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'

import stepCss from '../Steps.module.scss'
import css from './ShellScript.module.scss'

export const shellScriptType: SelectOption[] = [
  { label: 'Bash', value: 'BASH' },
  { label: 'Powershell', value: 'POWERSHELL' }
]

export default function BaseShellScript(props: { formik: FormikProps<ShellScriptStepInfo> }): React.ReactElement {
  const {
    formik: { values: formValues, setFieldValue }
  } = props

  const { getString } = useStrings()
  return (
    <div className={stepCss.stepPanel}>
      <div className={css.stepDesc}>
        <span className={css.stepType}>{getString('stepType')}</span> :{' '}
        <span className={css.stepValue}>{getString('shellScriptStep')}</span>
      </div>
      <div className={stepCss.formGroup}>
        <FormInput.InputWithIdentifier inputLabel={getString('pipelineSteps.stepNameLabel')} />
      </div>
      <div className={stepCss.formGroup}>
        <FormInput.Select
          items={shellScriptType}
          name="spec.shell"
          label={getString('scriptType')}
          placeholder={getString('scriptType')}
          style={{ width: 350 }}
          disabled
        />
      </div>
      <div className={stepCss.formGroup}>
        <FormMultiTypeTextAreaField name="spec.source.spec.script" label={getString('script')} />
        {getMultiTypeFromValue(formValues.spec.source?.spec?.script) === MultiTypeInputType.RUNTIME && (
          <ConfigureOptions
            value={formValues.spec.source?.spec?.script}
            type="String"
            variableName="spec.source.spec.script"
            showRequiredField={false}
            showDefaultField={false}
            showAdvanced={true}
            onChange={value => setFieldValue('spec.source.spec.script', value)}
          />
        )}
      </div>
    </div>
  )
}
