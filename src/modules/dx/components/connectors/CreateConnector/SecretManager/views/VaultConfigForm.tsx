import React, { useState } from 'react'
import * as Yup from 'yup'
import {
  Button,
  Formik,
  FormikForm,
  Layout,
  StepProps,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { pick } from 'lodash-es'

import { useToaster } from 'modules/common/exports'
import {
  ConnectorRequestBody,
  useCreateConnector,
  VaultConnectorDTO,
  VaultMetadataRequestSpecDTO
} from 'services/cd-ng'
import type { SecretManagerWizardData } from '../CreateSecretManager'
import i18n from '../CreateSecretManager.i18n'
import VaultConnectorFormFields, { vaultConnectorFormFieldsValidationSchema } from './VaultConnectorFormFields'

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

const validationSchema = Yup.object().shape({
  ...vaultConnectorFormFieldsValidationSchema,
  authToken: Yup.string().when('accessType', {
    is: 'TOKEN',
    then: Yup.string().trim().required(i18n.validationAuthToken)
  })
})

const VaultConfigForm: React.FC<StepProps<SecretManagerWizardData>> = ({ prevStepData, previousStep, nextStep }) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createSecretManager, loading } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })

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
      } catch (err) {
        modalErrorHandler?.showDanger(err?.data?.message)
      }
    }
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
            <VaultConnectorFormFields formik={formik} identifier={prevStepData?.detailsData?.identifier || ''} />
            <Layout.Horizontal spacing="medium">
              <Button text={i18n.buttonBack} onClick={() => previousStep?.(prevStepData)} />
              <Button intent="primary" type="submit" text={i18n.buttonNext} disabled={loading} />
            </Layout.Horizontal>
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export default VaultConfigForm
