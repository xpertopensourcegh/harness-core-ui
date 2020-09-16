import React from 'react'
import { FormInput } from '@wings-software/uikit'
import type { FormikProps } from 'formik'
import { AuthTypeFields } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import { FormikSecretTextInput } from 'modules/dx/components/SecretInput/SecretTextInput'
import {
  getLabelForEncryptedSecret,
  getSecretFieldValue,
  generateDefaultSecretConfig
} from 'modules/dx/pages/connectors/utils/ConnectorHelper'
import type { EncryptedDataDTO } from 'services/cd-ng'
import i18n from './OIDCTokenFields.i18n'
interface OIDCTokenFieldsProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  formikProps: FormikProps<unknown>
  name?: string
  onClickCreateSecret: () => void
  isEditMode?: boolean
  onEditSecret?: (val: EncryptedDataDTO) => void
}

const OIDCTokenFields: React.FC<OIDCTokenFieldsProps> = props => {
  const { accountId, formikProps, name = '' } = props
  return (
    <>
      <FormInput.Text name={AuthTypeFields.oidcIssuerUrl} label={i18n.PROVIDER_URL} />
      <FormInput.Text name={AuthTypeFields.oidcUsername} label={i18n.USERNAME} />
      <FormikSecretTextInput
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
        isEditMode={props.isEditMode}
        onEditSecret={props.onEditSecret}
      />
      <FormikSecretTextInput
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
        isEditMode={props.isEditMode}
        onEditSecret={props.onEditSecret}
      />
      <FormikSecretTextInput
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
        isEditMode={props.isEditMode}
        onEditSecret={props.onEditSecret}
      />
      <FormInput.Text name={AuthTypeFields.oidcScopes} label={i18n.OIDC_SCOPE} />
    </>
  )
}

export default OIDCTokenFields
