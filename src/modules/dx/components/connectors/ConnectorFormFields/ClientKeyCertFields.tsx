import React from 'react'
import { FormInput } from '@wings-software/uikit'
import type { FormikProps } from 'formik'
import { FormikSecretTextInput } from 'modules/dx/components/SecretInput/SecretTextInput'
import { AuthTypeFields } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import {
  getLabelForEncryptedSecret,
  getSecretFieldValue,
  generateDefaultSecretConfig
} from 'modules/dx/pages/connectors/utils/ConnectorHelper'

interface ClientKeyCertFieldsProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  formikProps: FormikProps<unknown>
  name?: string
  onClickCreateSecret: () => void
}

const ClientKeyCertFields: React.FC<ClientKeyCertFieldsProps> = props => {
  const { formikProps, accountId, name = '' } = props
  return (
    <>
      <FormikSecretTextInput
        fieldName={AuthTypeFields.clientKeyRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.clientKeyRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.clientKeyRef)}
        formikProps={formikProps}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.clientKeyRef)}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.clientKeyRef)}
        onClickCreateSecret={props.onClickCreateSecret}
      />
      <FormikSecretTextInput
        fieldName={AuthTypeFields.clientCertRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.clientCertRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.clientCertRef)}
        formikProps={formikProps}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.clientCertRef)}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.clientCertRef)}
        onClickCreateSecret={props.onClickCreateSecret}
      />
      <FormikSecretTextInput
        fieldName={AuthTypeFields.clientKeyPassphraseRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.clientKeyPassphraseRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.clientKeyPassphraseRef)}
        formikProps={formikProps}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.clientKeyPassphraseRef)}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.clientKeyPassphraseRef)}
        onClickCreateSecret={props.onClickCreateSecret}
      />
      <FormInput.Text
        name={AuthTypeFields.clientKeyAlgo}
        label={getLabelForEncryptedSecret(AuthTypeFields.clientKeyAlgo)}
      />
    </>
  )
}

export default ClientKeyCertFields
