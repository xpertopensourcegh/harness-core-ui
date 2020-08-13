import React from 'react'
import type { FormikProps } from 'formik'
import {
  AuthTypes,
  getSecretFieldValue,
  getLabelForEncryptedSecret,
  generateDefaultSecretConfig
} from 'modules/dx/pages/connectors/utils/ConnectorHelper'
import SecretTextInput from 'modules/dx/components/SecretInput/SecretTextInput'
import { AuthTypeFields } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import UsernamePassword from './UsernamePassword'
import OIDCTokenFields from './OIDCTokenFields'
import ClientKeyCertFields from './ClientKeyCertFields'

interface ConnectorFormFieldsProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  authType: string | number | symbol
  formikProps: FormikProps<unknown>
  name?: string
  onClickCreateSecret: () => void
}

const ConnectorFormFields: React.FC<ConnectorFormFieldsProps> = props => {
  const { accountId, authType, formikProps, name = '' } = props
  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return (
        <UsernamePassword
          accountId={accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          formikProps={formikProps}
          passwordField={AuthTypeFields.passwordRef}
          onClickCreateSecret={props.onClickCreateSecret}
        />
      )
    case AuthTypes.SERVICE_ACCOUNT:
      return (
        <SecretTextInput
          fieldName={AuthTypeFields.serviceAccountTokenRef}
          label={getLabelForEncryptedSecret(AuthTypeFields.serviceAccountTokenRef)}
          secretFieldName={getSecretFieldValue(AuthTypeFields.serviceAccountTokenRef)}
          formikProps={formikProps}
          accountId={accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.serviceAccountTokenRef)}
          defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.serviceAccountTokenRef)}
          onClickCreateSecret={props.onClickCreateSecret}
        />
      )
    case AuthTypes.OIDC:
      return (
        <OIDCTokenFields
          name={name}
          formikProps={formikProps}
          accountId={accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          onClickCreateSecret={props.onClickCreateSecret}
        />
      )
    case AuthTypes.CLIENT_KEY_CERT:
      return (
        <ClientKeyCertFields
          name={name}
          formikProps={formikProps}
          accountId={accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          onClickCreateSecret={props.onClickCreateSecret}
        />
      )
    default:
      return <></>
  }
}

export default ConnectorFormFields
