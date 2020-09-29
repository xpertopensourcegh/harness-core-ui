import React, { useState } from 'react'
import * as Yup from 'yup'
import {
  Button,
  Formik,
  FormikForm,
  FormInput,
  Layout,
  StepProps,
  ModalErrorHandlerBinding,
  ModalErrorHandler,
  SelectOption
} from '@wings-software/uikit'
import type { IOptionProps } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { pick } from 'lodash-es'

import { useToaster } from 'modules/common/exports'
import {
  ConnectorRequestBody,
  useCreateConnector,
  useGetMetadata,
  VaultConnectorDTO,
  VaultMetadataRequestSpecDTO,
  VaultAuthTokenCredentialDTO,
  VaultAppRoleCredentialDTO,
  VaultMetadataSpecDTO
} from 'services/cd-ng'
import type { SecretManagerWizardData } from '../CreateSecretManager'
import i18n from '../CreateSecretManager.i18n'

export interface VaultConfigFormData {
  vaultUrl: string
  basePath: string
  readOnly: boolean
  default: boolean
  accessType: VaultMetadataRequestSpecDTO['accessType']
  appRoleId?: string
  secretId?: string
  authToken?: string
  engineType?: 'fetch' | 'manual'
  secretEngine?: string
  secretEngineName?: string
  secretEngineVersion?: number
  renewIntervalHours: number
}

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

const validationSchema = Yup.object().shape({
  vaultUrl: Yup.string().trim().required(i18n.validationVaultUrl),
  authToken: Yup.string().when('accessType', {
    is: 'TOKEN',
    then: Yup.string().trim().required(i18n.validationAuthToken)
  }),
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
})

interface VaultConfigFormProps {
  onSuccess?: () => void
  closeModal?: () => void
}

const VaultConfigForm: React.FC<VaultConfigFormProps & StepProps<SecretManagerWizardData>> = ({
  prevStepData,
  previousStep,
  nextStep,
  onSuccess,
  closeModal
}) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { showSuccess, showError } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [secretEngineOptions, setSecretEngineOptions] = useState<SelectOption[]>([])
  const { mutate: createSecretManager, loading } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: getMetadata } = useGetMetadata({ queryParams: { accountIdentifier: accountId } })

  const handleFetchEngines = async (formData: VaultConfigFormData): Promise<void> => {
    try {
      const res = await getMetadata({
        identifier: prevStepData?.detailsData?.identifier || '',
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

  const handleSubmit = async (formData: VaultConfigFormData): Promise<void> => {
    if (prevStepData?.detailsData) {
      const dataToSubmit: ConnectorRequestBody = {
        connector: {
          orgIdentifier,
          projectIdentifier,
          ...pick(prevStepData.detailsData, ['name', 'identifier', 'description', 'tags']),
          type: 'Vault',
          spec: {
            ...pick(formData, ['authToken', 'basePath', 'vaultUrl', 'readOnly', 'default', 'renewIntervalHours']),
            secretEngineName:
              formData.engineType === 'manual' ? formData.secretEngineName : formData.secretEngine?.split('@@@')[0],
            secretEngineVersion:
              formData.engineType === 'manual' ? formData.secretEngineVersion : formData.secretEngine?.split('@@@')[1]
          } as VaultConnectorDTO
        }
      }

      try {
        await createSecretManager(dataToSubmit)
        nextStep?.({ ...prevStepData, configureData: formData })
        showSuccess(i18n.messageSuccess)
        closeModal?.()
        onSuccess?.()
      } catch (err) {
        modalErrorHandler?.showDanger(err?.data?.message)
      }
    }
  }

  const isFetchDisabled = (formData: VaultConfigFormData): boolean => {
    if (!formData.vaultUrl.trim()) return true
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
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Formik<VaultConfigFormData>
        initialValues={{
          vaultUrl: '',
          basePath: '',
          readOnly: false,
          default: false,
          accessType: 'APP_ROLE',
          appRoleId: '',
          secretId: '',
          authToken: '',
          engineType: 'fetch',
          secretEngineName: '',
          secretEngineVersion: 2,
          renewIntervalHours: 1,
          ...prevStepData?.configureData
        }}
        validationSchema={validationSchema}
        onSubmit={formData => {
          handleSubmit(formData)
        }}
      >
        {formik => (
          <FormikForm>
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
                <FormInput.Text name="secretId" label={i18n.labelSecretId} />
              </Layout.Horizontal>
            ) : (
              <FormInput.Text name="authToken" label={i18n.labelToken} inputGroup={{ type: 'password' }} />
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
            <Layout.Horizontal spacing="medium">
              <Button text={i18n.buttonBack} onClick={() => previousStep?.()} />
              <Button intent="primary" type="submit" text={i18n.buttonNext} disabled={loading} />
            </Layout.Horizontal>
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default VaultConfigForm
