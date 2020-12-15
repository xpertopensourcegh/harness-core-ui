import React, { useState } from 'react'
import { FormInput, Layout, Button, SelectOption } from '@wings-software/uikit'
import type { IOptionProps } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import type { FormikContext } from 'formik'
import * as Yup from 'yup'
import {
  VaultAppRoleCredentialDTO,
  VaultAuthTokenCredentialDTO,
  VaultMetadataRequestSpecDTO,
  VaultMetadataSpecDTO,
  useGetMetadata
} from 'services/cd-ng'
import { useToaster } from '@common/exports'
import type { VaultConfigFormData } from './VaultConfigForm'

import i18n from '../CreateHashiCorpVault.i18n'

const accessTypeOptions: IOptionProps[] = [
  {
    label: 'App Role',
    value: 'APP_ROLE'
  },
  {
    label: 'Token',
    value: 'TOKEN'
  }
]

const engineTypeOptions: IOptionProps[] = [
  {
    label: 'Fetch Engines',
    value: 'fetch'
  },
  {
    label: 'Manually Configure Engine',
    value: 'manual'
  }
]

interface VaultConnectorFormFieldsProps {
  formik: FormikContext<VaultConfigFormData>
  isEditing?: boolean
  identifier: string
}

export const vaultConnectorFormFieldsValidationSchema = {
  vaultUrl: Yup.string().trim().required(i18n.validationVaultUrl),
  appRoleId: Yup.string().when('accessType', {
    is: 'APP_ROLE',
    then: Yup.string().trim().required(i18n.validationAppRole)
  }),
  secretId: Yup.string().when('accessType', {
    is: 'APP_ROLE',
    then: Yup.string().trim().required(i18n.validationSecretId)
  }),
  secretEngineName: Yup.string().when('engineType', {
    is: 'manual',
    then: Yup.string().trim().required(i18n.validationEngine)
  }),
  secretEngineVersion: Yup.number().when('engineType', {
    is: 'manual',
    then: Yup.number().positive(i18n.validationVersionNumber).required(i18n.validationVersion)
  }),
  secretEngine: Yup.string().when('engineType', {
    is: 'fetch',
    then: Yup.string().trim().required(i18n.validationSecretEngine)
  }),
  renewIntervalHours: Yup.number().positive(i18n.validationRenewalNumber).required(i18n.validationRenewal)
}

const VaultConnectorFormFields: React.FC<VaultConnectorFormFieldsProps> = ({ formik, identifier, isEditing }) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { showError } = useToaster()
  const [secretEngineOptions, setSecretEngineOptions] = useState<SelectOption[]>([])
  const { mutate: getMetadata } = useGetMetadata({ queryParams: { accountIdentifier: accountId } })

  const handleFetchEngines = async (formData: VaultConfigFormData): Promise<void> => {
    try {
      const res = await getMetadata({
        identifier,
        encryptionType: 'VAULT',
        orgIdentifier,
        projectIdentifier,
        spec: {
          url: formData.vaultUrl,
          accessType: formData.accessType.toUpperCase(),
          spec:
            formData.accessType === 'APP_ROLE'
              ? ({
                  appRoleId: formData.appRoleId,
                  secretId: formData.secretId
                } as VaultAppRoleCredentialDTO)
              : ({
                  authToken: formData.authToken
                } as VaultAuthTokenCredentialDTO)
        } as VaultMetadataRequestSpecDTO
      })
      setSecretEngineOptions(
        (res.data?.spec as VaultMetadataSpecDTO)?.secretEngines?.map(secretEngine => {
          return {
            label: secretEngine.name || '',
            value: `${secretEngine.name || ''}@@@${secretEngine.version || 2}`
          }
        }) || []
      )
    } catch (err) {
      showError(err?.data?.message)
    }
  }
  const isFetchDisabled = (formData: VaultConfigFormData): boolean => {
    if (!formData.vaultUrl?.trim()) return true
    switch (formData.accessType) {
      case 'APP_ROLE':
        if (!formData.appRoleId?.trim() || !formData.secretId?.trim()) return true
        break
      case 'TOKEN':
        if (!formData.authToken?.trim()) return true
        break
    }
    return false
  }

  return (
    <>
      <FormInput.Text name="vaultUrl" label={i18n.labelVaultUrl} />
      <FormInput.Text name="basePath" label={i18n.labelBaseSecretPath} />
      <FormInput.RadioGroup
        name="accessType"
        label={i18n.labelAuth}
        radioGroup={{ inline: true }}
        items={accessTypeOptions}
      />
      {formik?.values['accessType'] === 'APP_ROLE' ? (
        <Layout.Horizontal spacing="medium">
          <FormInput.Text name="appRoleId" label={i18n.labelAppRoleId} />
          <FormInput.Text name="secretId" label={i18n.labelSecretId} inputGroup={{ type: 'password' }} />
        </Layout.Horizontal>
      ) : (
        <FormInput.Text
          name="authToken"
          label={i18n.labelToken}
          inputGroup={{ type: 'password' }}
          placeholder={isEditing ? i18n.placeholderEncrypted : ''}
        />
      )}
      <FormInput.RadioGroup
        name="engineType"
        label="Secret Engine"
        radioGroup={{ inline: true }}
        items={engineTypeOptions}
      />
      {formik.values['engineType'] === 'fetch' ? (
        <Layout.Horizontal spacing="medium">
          <FormInput.Select
            name="secretEngine"
            items={secretEngineOptions}
            disabled={secretEngineOptions.length === 0}
          />
          <Button
            intent="primary"
            text="Fetch Engines"
            margin={{ top: 'xsmall' }}
            onClick={() => handleFetchEngines(formik.values)}
            disabled={isFetchDisabled(formik.values)}
          />
        </Layout.Horizontal>
      ) : null}
      {formik.values['engineType'] === 'manual' ? (
        <Layout.Horizontal spacing="medium">
          <FormInput.Text name="secretEngineName" label={i18n.labelSecretEngineName} />
          <FormInput.Text name="secretEngineVersion" label={i18n.labelSecretEngineVersion} />
        </Layout.Horizontal>
      ) : null}

      <FormInput.Text name="renewIntervalHours" label={i18n.labelRenewal} />
      <FormInput.CheckBox name="readOnly" label={i18n.labelReadOnly} padding={{ left: 'xxlarge' }} />
      <FormInput.CheckBox name="default" label={i18n.labelDefault} padding={{ left: 'xxlarge' }} />
    </>
  )
}

export default VaultConnectorFormFields
