import React from 'react'
import { FormInput } from '@wings-software/uikit'
import type { FormikProps } from 'formik'
import { AuthTypeFields } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import SecretTextInput from 'modules/dx/components/SecretInput/SecretTextInput'
import {
  getLabelForEncryptedSecret,
  getSecretFieldValue,
  generateDefaultSecretConfig
} from 'modules/dx/pages/connectors/utils/ConnectorHelper'
import i18n from './OIDCTokenFields.i18n'
interface OIDCTokenFieldsProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  formikProps: FormikProps<unknown>
  name?: string
  onClickCreateSecret: () => void
}

const OIDCTokenFields: React.FC<OIDCTokenFieldsProps> = props => {
  const { accountId, formikProps, name = '' } = props
  return (
    <>
      <FormInput.Text name={AuthTypeFields.oidcIssuerUrl} label={i18n.PROVIDER_URL} />
      <FormInput.Text name={AuthTypeFields.oidcUsername} label={i18n.USERNAME} />
      <SecretTextInput
        fieldName={AuthTypeFields.oidcPasswordRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.oidcPasswordRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.oidcPasswordRef)}
        formikProps={formikProps}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.oidcPasswordRef)}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.oidcPasswordRef)}
        onClickCreateSecret={props.onClickCreateSecret}
      />
      <SecretTextInput
        fieldName={AuthTypeFields.oidcClientIdRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.oidcClientIdRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.oidcClientIdRef)}
        formikProps={formikProps}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.oidcClientIdRef)}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.oidcClientIdRef)}
        onClickCreateSecret={props.onClickCreateSecret}
      />
      <SecretTextInput
        fieldName={AuthTypeFields.oidcSecretRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.oidcSecretRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.oidcSecretRef)}
        formikProps={formikProps}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.oidcSecretRef)}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.oidcSecretRef)}
        onClickCreateSecret={props.onClickCreateSecret}
      />
      <FormInput.Text name={AuthTypeFields.oidcScopes} label="OIDC Scopes" />
    </>
  )
}

export default OIDCTokenFields
