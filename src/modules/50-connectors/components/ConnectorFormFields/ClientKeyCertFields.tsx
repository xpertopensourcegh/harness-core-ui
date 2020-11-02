import React from 'react'
import { FormInput } from '@wings-software/uikit'
import type { FormikProps } from 'formik'
import { FormikSecretTextInput } from '@secrets/components/SecretInput/SecretTextInput'
import { AuthTypeFields } from '@connectors/pages/connectors/Forms/KubeFormHelper'
import {
  getLabelForEncryptedSecret,
  getSecretFieldValue,
  generateDefaultSecretConfig
} from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { SecretDTOV2, ConnectorConfigDTO } from 'services/cd-ng'

interface ClientKeyCertFieldsProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  name?: string
  onClickCreateSecret: () => void
  isEditMode?: boolean
  onEditSecret?: (val: SecretDTOV2) => void
  formik?: FormikProps<ConnectorConfigDTO>
}

const ClientKeyCertFields: React.FC<ClientKeyCertFieldsProps> = props => {
  const { accountId, name = '' } = props
  return (
    <>
      <FormikSecretTextInput
        fieldName={AuthTypeFields.clientKeyRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.clientKeyRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.clientKeyRef)}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.clientKeyRef)}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.clientKeyRef)}
        onClickCreateSecret={props.onClickCreateSecret}
        isEditMode={props.isEditMode && !!props.formik?.values?.[getSecretFieldValue(AuthTypeFields.clientKeyRef)]}
        onEditSecret={props.onEditSecret}
      />
      <FormikSecretTextInput
        fieldName={AuthTypeFields.clientCertRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.clientCertRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.clientCertRef)}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.clientCertRef)}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.clientCertRef)}
        onClickCreateSecret={props.onClickCreateSecret}
        isEditMode={props.isEditMode && !!props.formik?.values?.[getSecretFieldValue(AuthTypeFields.clientCertRef)]}
        onEditSecret={props.onEditSecret}
      />
      <FormikSecretTextInput
        fieldName={AuthTypeFields.clientKeyPassphraseRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.clientKeyPassphraseRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.clientKeyPassphraseRef)}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.clientKeyPassphraseRef)}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.clientKeyPassphraseRef)}
        onClickCreateSecret={props.onClickCreateSecret}
        isEditMode={
          props.isEditMode && !!props.formik?.values?.[getSecretFieldValue(AuthTypeFields.clientKeyPassphraseRef)]
        }
        onEditSecret={props.onEditSecret}
      />
      <FormikSecretTextInput
        fieldName={AuthTypeFields.caCertRef}
        label={getLabelForEncryptedSecret(AuthTypeFields.caCertRef)}
        secretFieldName={getSecretFieldValue(AuthTypeFields.caCertRef)}
        accountId={accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        defaultSecretName={generateDefaultSecretConfig(name, AuthTypeFields.caCertRef)}
        defaultSecretId={generateDefaultSecretConfig(name, AuthTypeFields.caCertRef)}
        onClickCreateSecret={props.onClickCreateSecret}
        isEditMode={props.isEditMode && !!props.formik?.values?.[getSecretFieldValue(AuthTypeFields.caCertRef)]}
        onEditSecret={props.onEditSecret}
      />

      <FormInput.Text
        name={AuthTypeFields.clientKeyAlgo}
        label={getLabelForEncryptedSecret(AuthTypeFields.clientKeyAlgo)}
      />
    </>
  )
}

export default ClientKeyCertFields
