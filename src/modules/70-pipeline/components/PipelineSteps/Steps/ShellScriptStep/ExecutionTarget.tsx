import React from 'react'
import { Text, FormInput, getMultiTypeFromValue, MultiTypeInputType, Layout } from '@wings-software/uicore'
import type { IOptionProps } from '@blueprintjs/core'
import type { FormikProps } from 'formik'
import { useStrings } from 'framework/exports'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import MultiTypeSecretInput from '@secrets/components/MutiTypeSecretInput/MultiTypeSecretInput'
import type { ShellScriptFormData } from './shellScriptTypes'
import stepCss from '../Steps.module.scss'
import css from './ShellScript.module.scss'

export const connectionTypeOptions = [{ label: 'SSH', value: 'SSH' }]

export default function ExecutionTarget(props: { formik: FormikProps<ShellScriptFormData> }): React.ReactElement {
  const {
    formik: { values: formValues, setFieldValue }
  } = props

  const { getString } = useStrings()

  const targetTypeOptions: IOptionProps[] = [
    {
      label: 'Specify Target Host',
      value: 'targethost'
    },
    {
      label: 'On Delegate',
      value: 'delegate'
    }
  ]

  return (
    <div className={stepCss.stepPanel}>
      <div className={css.stepDesc}>
        <Text className={css.stepValue}>{getString('executeScript')}</Text>
      </div>
      <div className={stepCss.formGroup}>
        <FormInput.RadioGroup
          name="spec.onDelegate"
          radioGroup={{ inline: true }}
          items={targetTypeOptions}
          className={css.radioGroup}
        />
      </div>
      {formValues.spec.onDelegate === 'targethost' ? (
        <>
          <div className={stepCss.formGroup}>
            <FormInput.MultiTextInput
              name="spec.executionTarget.host"
              label={getString('targetHost')}
              style={{ marginTop: 'var(--spacing-small)' }}
            />
            {getMultiTypeFromValue(formValues.spec.executionTarget.host) === MultiTypeInputType.RUNTIME && (
              <ConfigureOptions
                value={formValues.spec.executionTarget.host}
                type="String"
                variableName="spec.executionTarget.host"
                showRequiredField={false}
                showDefaultField={false}
                showAdvanced={true}
                onChange={value => setFieldValue('spec.executionTarget.host', value)}
              />
            )}
          </div>
          <div className={stepCss.formGroup}>
            <MultiTypeSecretInput
              type="SSHKey"
              name="spec.executionTarget.connectorRef"
              label={getString('sshConnector')}
            />
            {getMultiTypeFromValue(formValues?.spec.executionTarget.connectorRef) === MultiTypeInputType.RUNTIME && (
              <ConfigureOptions
                value={formValues?.spec.executionTarget.connectorRef as string}
                type={
                  <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                    <Text>{getString('pipelineSteps.connectorLabel')}</Text>
                  </Layout.Horizontal>
                }
                variableName="spec.executionTarget.connectorRef"
                showRequiredField={false}
                showDefaultField={false}
                showAdvanced={true}
                onChange={value => {
                  setFieldValue('spec.executionTarget.connectorRef', value)
                }}
              />
            )}
          </div>
          <div className={stepCss.formGroup}>
            <FormInput.MultiTextInput
              name="spec.executionTarget.workingDirectory"
              label={getString('workingDirectory')}
              style={{ marginTop: 'var(--spacing-medium)' }}
            />
            {getMultiTypeFromValue(formValues.spec.executionTarget.workingDirectory) === MultiTypeInputType.RUNTIME && (
              <ConfigureOptions
                value={formValues.spec.executionTarget.workingDirectory}
                type="String"
                variableName="spec.executionTarget.workingDirectory"
                showRequiredField={false}
                showDefaultField={false}
                showAdvanced={true}
                onChange={value => setFieldValue('spec.executionTarget.workingDirectory', value)}
              />
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
