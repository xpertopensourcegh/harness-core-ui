import React from 'react'
import { FormInput } from '@wings-software/uikit'
import type { FormikProps } from 'formik'
import SecretTextInput from 'modules/dx/components/SecretInput/SecretTextInput'
import {
  getLabelForEncryptedSecret,
  getSecretFieldValue,
  generateDefaultSecretConfig
} from 'modules/dx/pages/connectors/utils/ConnectorHelper'

interface UsernamePasswordProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  formikProps: FormikProps<unknown>
  passwordField: string
  name?: string
  onClickCreateSecret: () => void
}

const UsernamePassword: React.FC<UsernamePasswordProps> = props => {
  const { accountId, formikProps, passwordField, name = '' } = props

  return (
    <>
      <FormInput.Text name="username" label="Username" />
      <SecretTextInput
        fieldName={passwordField}
        label={getLabelForEncryptedSecret(passwordField)}
        secretFieldName={getSecretFieldValue(passwordField)}
        formikProps={formikProps}
        accountId={accountId}
        projectIdentifier={props.projectIdentifier}
        orgIdentifier={props.orgIdentifier}
        defaultSecretId={generateDefaultSecretConfig(name, passwordField)}
        defaultSecretName={generateDefaultSecretConfig(name, passwordField)}
        onClickCreateSecret={props.onClickCreateSecret}
      />
    </>
  )
}

export default UsernamePassword
