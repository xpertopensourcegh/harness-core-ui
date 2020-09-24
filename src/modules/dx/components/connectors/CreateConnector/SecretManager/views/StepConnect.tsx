import React from 'react'
import type { IOptionProps } from '@blueprintjs/core'
import {
  Button,
  Container,
  Formik,
  FormikForm,
  FormInput,
  Layout,
  SelectOption,
  StepProps,
  Text
} from '@wings-software/uikit'
import * as Yup from 'yup'

import type { ConnectorDTO } from 'services/cd-ng'
import type { SecretManagerWizardData } from '../CreateSecretManager'
import i18n from '../CreateSecretManager.i18n'

export interface ConnectFormData {
  encryptionType: ConnectorDTO['type']
  vaultUrl: string
  basePath: string
  readOnly: boolean
  default: boolean
  authType: string
  authToken: string
}

const StepConnect: React.FC<StepProps<SecretManagerWizardData>> = ({ prevStepData, nextStep, previousStep }) => {
  const encryptionTypeOptions: SelectOption[] = [
    {
      label: 'HashiCorp Vault',
      value: 'Vault'
    }
  ]
  const authTypeOptions: IOptionProps[] = [
    {
      label: 'App Role',
      value: 'appRoleId'
    },
    {
      label: 'Token',
      value: 'token'
    }
  ]
  return (
    <Container padding={{ top: 'medium' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {i18n.titleConnect}
      </Text>
      <Formik<ConnectFormData>
        initialValues={{
          encryptionType: 'Vault',
          vaultUrl: '',
          basePath: '',
          readOnly: false,
          default: false,
          authType: 'appRoleId',
          authToken: '',
          ...prevStepData?.connectData
        }}
        validationSchema={Yup.object().shape({
          encryptionType: Yup.string().required(i18n.validationEncType),
          vaultUrl: Yup.string().required(i18n.validationVaultUrl),
          authToken: Yup.string().when('authType', {
            is: 'token',
            then: Yup.string().required(i18n.validationAuthToken)
          }),
          appRoleId: Yup.string().when('authType', {
            is: 'appRoleId',
            then: Yup.string().required(i18n.validationAppRole)
          }),
          secretId: Yup.string().when('authType', {
            is: 'appRoleId',
            then: Yup.string().required(i18n.validationSecretId)
          })
        })}
        onSubmit={data => {
          nextStep?.({ ...prevStepData, connectData: data })
        }}
      >
        {formikProps => (
          <FormikForm>
            <FormInput.Select name="encryptionType" label={i18n.labelEncType} items={encryptionTypeOptions} />
            <FormInput.Text name="vaultUrl" label={i18n.labelVaultUrl} />
            <FormInput.Text name="basePath" label={i18n.labelBaseSecretPath} />
            <FormInput.RadioGroup
              name="authType"
              label={i18n.labelAuth}
              radioGroup={{ inline: true }}
              items={authTypeOptions}
            />
            {formikProps.values['authType'] === 'appRoleId' ? (
              <>
                <FormInput.Text name="appRoleId" label={i18n.labelAppRoleId} />
                <FormInput.Text name="secretId" label={i18n.labelSecretId} />
              </>
            ) : (
              <FormInput.Text name="authToken" label={i18n.labelToken} inputGroup={{ type: 'password' }} />
            )}
            <FormInput.CheckBox name="readOnly" label={i18n.labelReadOnly} padding={{ left: 'xxlarge' }} />
            <FormInput.CheckBox name="default" label={i18n.labelDefault} padding={{ left: 'xxlarge' }} />
            <Layout.Horizontal spacing="medium">
              <Button
                text={i18n.buttonBack}
                onClick={() => {
                  previousStep?.(prevStepData)
                }}
              />
              <Button type="submit" intent="primary" text={i18n.buttonNext} />
            </Layout.Horizontal>
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

export default StepConnect
