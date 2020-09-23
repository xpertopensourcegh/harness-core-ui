import React from 'react'
import { FormInput } from '@wings-software/uikit'
import { FormikSecretTextInput } from 'modules/dx/components/SecretInput/SecretTextInput'
import {
  getLabelForEncryptedSecret,
  getSecretFieldValue,
  generateDefaultSecretConfig
} from 'modules/dx/pages/connectors/utils/ConnectorHelper'
import type { SecretDTOV2 } from 'services/cd-ng'

interface UsernamePasswordProps {
  accountId: string
  projectIdentifier?: string
  orgIdentifier?: string
  passwordField: string
  name?: string
  onClickCreateSecret: () => void
  isEditMode?: boolean
  onEditSecret?: (val: SecretDTOV2) => void
  isOptional?: boolean
}

const UsernamePassword: React.FC<UsernamePasswordProps> = props => {
  const { accountId, passwordField, name = '', isOptional = false } = props

  return (
    <>
      <FormInput.Text name="username" label={`Username ${isOptional ? '(Optional)' : ''}`} />
      <FormikSecretTextInput
        fieldName={passwordField}
        label={`${getLabelForEncryptedSecret(passwordField)} ${isOptional ? '(Optional)' : ''}`}
        secretFieldName={getSecretFieldValue(passwordField)}
        accountId={accountId}
        projectIdentifier={props.projectIdentifier}
        orgIdentifier={props.orgIdentifier}
        defaultSecretId={generateDefaultSecretConfig(name, passwordField)}
        defaultSecretName={generateDefaultSecretConfig(name, passwordField)}
        onClickCreateSecret={props.onClickCreateSecret}
        isEditMode={props.isEditMode}
        onEditSecret={props.onEditSecret}
      />
    </>
  )
}

export default UsernamePassword
