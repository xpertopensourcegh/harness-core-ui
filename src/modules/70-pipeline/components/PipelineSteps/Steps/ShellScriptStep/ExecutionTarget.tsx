import React from 'react'
import { useParams } from 'react-router-dom'
import { Text, FormInput, getMultiTypeFromValue, MultiTypeInputType, TextInput, Layout } from '@wings-software/uicore'
import type { IOptionProps } from '@blueprintjs/core'
import type { FormikProps } from 'formik'
import { useStrings } from 'framework/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import type { PipelineType } from '@common/interfaces/RouteInterfaces'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import type { ShellScriptFormData } from './shellScriptTypes'
import stepCss from '../Steps.module.scss'
import css from './ShellScript.module.scss'

export const connectionTypeOptions = [{ label: 'SSH', value: 'SSH' }]

export default function ExecutionTarget(props: {
  formik: FormikProps<ShellScriptFormData>
  loading: any
}): React.ReactElement {
  const {
    formik: { values: formValues, setFieldValue },
    loading
  } = props

  const { accountId, projectIdentifier, orgIdentifier } = useParams<
    PipelineType<{
      projectIdentifier: string
      orgIdentifier: string
      accountId: string
    }>
  >()

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
            {loading ? (
              <TextInput value={getString('loading')} />
            ) : (
              <FormMultiTypeConnectorField
                name="spec.executionTarget.connectorRef"
                label={getString('sshConnector')}
                placeholder={loading ? getString('loading') : getString('select')}
                disabled={loading}
                accountIdentifier={accountId}
                projectIdentifier={projectIdentifier as string}
                orgIdentifier={orgIdentifier as string}
                width={465}
                isNewConnectorLabelVisible={false}
                enableConfigureOptions={false}
                type="Git"
              />
            )}

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
