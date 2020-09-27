import React from 'react'
import type { FormikProps } from 'formik'
import {
  AuthTypes,
  getSecretFieldValue,
  getLabelForEncryptedSecret,
  generateDefaultSecretConfig
} from 'modules/dx/pages/connectors/utils/ConnectorHelper'
import { FormikSecretTextInput } from 'modules/dx/components/SecretInput/SecretTextInput'
import { AuthTypeFields } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import type { SecretDTOV2, ConnectorConfigDTO } from 'services/cd-ng'
import UsernamePassword from './UsernamePassword'
import OIDCTokenFields from './OIDCTokenFields'
import ClientKeyCertFields from './ClientKeyCertFields'

interface ConnectorFormFieldsProps {
  formik?: FormikProps<ConnectorConfigDTO>
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  authType: string | number | symbol
  name?: string
  onClickCreateSecret: () => void
  isEditMode?: boolean
  onEditSecret?: (val: SecretDTOV2) => void
}

const ConnectorFormFields: React.FC<ConnectorFormFieldsProps> = props => {
  const { accountId, authType, name = '' } = props
  switch (authType) {
    case AuthTypes.USER_PASSWORD:
      return (
        <UsernamePassword
          name={name}
          isEditMode={props.isEditMode}
          accountId={accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          passwordField={AuthTypeFields.passwordRef}
          onClickCreateSecret={props.onClickCreateSecret}
          onEditSecret={props.onEditSecret}
          formik={props.formik}
        />
      )
    case AuthTypes.SERVICE_ACCOUNT:
      return (
        <FormikSecretTextInput
          fieldName={AuthTypeFields.serviceAccountTokenRef}
          label={getLabelForEncryptedSecret(AuthTypeFields.serviceAccountTokenRef)}
          secretFieldName={getSecretFieldValue(AuthTypeFields.serviceAccountTokenRef)}
          accountId={accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.serviceAccountTokenRef)}
          defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.serviceAccountTokenRef)}
          onClickCreateSecret={props.onClickCreateSecret}
          onEditSecret={props.onEditSecret}
          isEditMode={props.isEditMode && !!props.formik?.values?.['serviceAccountTokenRefSecret']}
        />
      )
    case AuthTypes.OIDC:
      return (
        <OIDCTokenFields
          name={name}
          accountId={accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          onClickCreateSecret={props.onClickCreateSecret}
          isEditMode={props.isEditMode}
          onEditSecret={props.onEditSecret}
          formik={props.formik}
        />
      )
    case AuthTypes.CLIENT_KEY_CERT:
      return (
        <ClientKeyCertFields
          name={name}
          accountId={accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          onClickCreateSecret={props.onClickCreateSecret}
          isEditMode={props.isEditMode}
          onEditSecret={props.onEditSecret}
          formik={props.formik}
        />
      )
    default:
      return <></>
  }
}

export default ConnectorFormFields
