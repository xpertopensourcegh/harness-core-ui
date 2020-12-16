import React, { useState } from 'react'
import * as Yup from 'yup'
import {
  Button,
  Formik,
  FormikForm,
  Layout,
  StepProps,
  ModalErrorHandlerBinding,
  ModalErrorHandler,
  Container,
  Text
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { pick } from 'lodash-es'

import { useToaster } from '@common/exports'
import {
  ConnectorRequestBody,
  useCreateConnector,
  useUpdateConnector,
  VaultConnectorDTO,
  VaultMetadataRequestSpecDTO
} from 'services/cd-ng'
import { useStrings } from 'framework/exports'
import i18n from '../CreateHashiCorpVault.i18n'
import VaultConnectorFormFields, { vaultConnectorFormFieldsValidationSchema } from './VaultConnectorFormFields'
import type { CreateHashiCorpVaultProps, StepSecretManagerProps } from '../CreateHashiCorpVault'

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

const VaultConfigForm: React.FC<StepProps<StepSecretManagerProps> & CreateHashiCorpVaultProps> = ({
  prevStepData,
  previousStep,
  nextStep,
  isEditMode
}) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const { getString } = useStrings()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: CreateHashiCorpVault, loading: createLoading } = useCreateConnector({
    queryParams: { accountIdentifier: accountId }
  })
  const { mutate: updateSecretManager, loading: updateLoading } = useUpdateConnector({
    queryParams: { accountIdentifier: accountId }
  })

  const handleSubmit = async (formData: VaultConfigFormData): Promise<void> => {
    if (prevStepData) {
      const dataToSubmit: ConnectorRequestBody = {
        connector: {
          orgIdentifier,
          projectIdentifier,
          ...pick(prevStepData, ['name', 'identifier', 'description', 'tags']),
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
        if (!isEditMode && prevStepData.isEdit != true) {
          await CreateHashiCorpVault(dataToSubmit)
          nextStep?.({ ...prevStepData, spec: { ...formData }, isEdit: true })
          showSuccess(getString('secretManager.createmessageSuccess'))
        } else {
          await updateSecretManager(dataToSubmit)
          nextStep?.({ ...prevStepData, spec: { ...formData }, isEdit: true })
          showSuccess(getString('secretManager.editmessageSuccess'))
        }
      } catch (err) {
        modalErrorHandler?.showDanger(err?.data?.message)
      }
    }
  }

  return (
    <Container padding={{ top: 'medium' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {i18n.titleConnect}
      </Text>
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
          ...prevStepData?.spec
        }}
        validationSchema={validationSchema}
        onSubmit={formData => {
          handleSubmit(formData)
        }}
      >
        {formik => (
          <FormikForm>
            <VaultConnectorFormFields formik={formik} identifier={prevStepData?.identifier || ''} />
            <Layout.Horizontal spacing="medium">
              <Button text={i18n.buttonBack} onClick={() => previousStep?.(prevStepData)} />
              <Button intent="primary" type="submit" text={i18n.buttonNext} disabled={updateLoading || createLoading} />
            </Layout.Horizontal>
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

export default VaultConfigForm
