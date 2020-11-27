import React, { useState } from 'react'
import {
  StepProps,
  Container,
  Formik,
  FormikForm,
  Button,
  Text,
  Color,
  ModalErrorHandler,
  ModalErrorHandlerBinding,
  Layout
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'

import { SecretRequestWrapper, usePostSecret, SSHAuthDTO, ResponsePageSecretResponseWrapper } from 'services/cd-ng'
import type { KerberosConfigDTO, SSHConfigDTO, SSHKeySpecDTO } from 'services/cd-ng'
import type { SecretReference } from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'
import SSHAuthFormFields from '@secrets/components/SSHAuthFormFields/SSHAuthFormFields'
import { buildAuthConfig } from '@secrets/utils/SSHAuthUtils'
import { useToaster } from '@common/exports'
import type { SSHCredSharedObj } from '../CreateSSHCredWizard'

import i18n from '../CreateSSHCredModal.i18n'

export interface SSHConfigFormData {
  authScheme: SSHAuthDTO['type']
  credentialType: SSHConfigDTO['credentialType']
  tgtGenerationMethod: KerberosConfigDTO['tgtGenerationMethod'] | 'None'
  userName: string
  port: number
  key?: SecretReference
  principal: string
  realm: string
  keyPath: string
  encryptedPassphrase?: SecretReference
  password?: SecretReference
}

interface StepAuthenticationProps {
  onSuccess?: () => void
  mockSecretReference?: ResponsePageSecretResponseWrapper
}

const validationSchema = Yup.object().shape({
  port: Yup.number().required(i18n.validatePort),
  userName: Yup.string().when('authScheme', {
    is: 'SSH',
    then: Yup.string().trim().required(i18n.validateUsername)
  }),
  keyPath: Yup.string().when(['authScheme', 'credentialType', 'tgtGenerationMethod'], {
    is: (authScheme, credentialType, tgtGenerationMethod) =>
      (authScheme === 'SSH' && credentialType == 'KeyPath') ||
      (authScheme === 'Kerberos' && tgtGenerationMethod == 'KeyTabFilePath'),
    then: Yup.string().trim().required(i18n.validateKeypath)
  }),
  key: Yup.object().when(['authScheme', 'credentialType'], {
    is: (authScheme, credentialType) => authScheme === 'SSH' && credentialType == 'KeyReference',
    then: Yup.object().required(i18n.validateSshKey)
  }),
  principal: Yup.string().when('authScheme', {
    is: 'Kerberos',
    then: Yup.string().trim().required(i18n.validatePrincipal)
  }),
  realm: Yup.string().when('authScheme', {
    is: 'Kerberos',
    then: Yup.string().trim().required(i18n.validateRealm)
  })
})

const StepAuthentication: React.FC<StepProps<SSHCredSharedObj> & StepAuthenticationProps> = ({
  prevStepData,
  nextStep,
  previousStep,
  onSuccess,
  mockSecretReference
}) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const [saving, setSaving] = useState(false)
  const { showSuccess } = useToaster()
  const { mutate: createSecret } = usePostSecret({ queryParams: { accountIdentifier: accountId } })
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding>()

  const handleSubmit = async (formData: SSHConfigFormData): Promise<void> => {
    setSaving(true)
    try {
      const authConfig = buildAuthConfig(formData)
      // build final data to submit
      const dataToSubmit: SecretRequestWrapper = {
        secret: {
          type: 'SSHKey',
          name: prevStepData?.detailsData?.name as string,
          identifier: prevStepData?.detailsData?.identifier as string,
          description: prevStepData?.detailsData?.description,
          tags: {},
          projectIdentifier,
          orgIdentifier,
          spec: {
            auth: {
              type: formData.authScheme,
              spec: authConfig
            },
            port: formData.port
          } as SSHKeySpecDTO
        }
      }

      // finally create the connector
      await createSecret(dataToSubmit)
      setSaving(false)
      showSuccess(i18n.messageSuccess)
      onSuccess?.()
      nextStep?.({ ...prevStepData, authData: formData })
    } catch (err) {
      setSaving(false)
      modalErrorHandler?.show(err.data)
    }
  }

  return (
    <>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Container padding="small" width={350} style={{ minHeight: '500px' }}>
        <Text margin={{ bottom: 'xlarge' }} font={{ size: 'medium' }} color={Color.BLACK}>
          {i18n.titleAuth}
        </Text>
        <Formik<SSHConfigFormData>
          onSubmit={formData => {
            modalErrorHandler?.hide()
            handleSubmit(formData)
          }}
          validationSchema={validationSchema}
          initialValues={{
            authScheme: 'SSH',
            credentialType: 'KeyReference',
            tgtGenerationMethod: 'None',
            userName: '',
            principal: '',
            realm: '',
            keyPath: '',
            port: 22,
            ...prevStepData?.authData
          }}
        >
          {formik => {
            return (
              <FormikForm>
                <SSHAuthFormFields
                  formik={formik}
                  secretName={prevStepData?.detailsData?.name}
                  mockSecretReference={mockSecretReference}
                />
                <Layout.Horizontal spacing="small">
                  <Button text="Back" onClick={() => previousStep?.({ ...prevStepData, authData: formik.values })} />
                  <Button type="submit" text={saving ? i18n.btnSaving : i18n.btnSave} disabled={saving} />
                </Layout.Horizontal>
              </FormikForm>
            )
          }}
        </Formik>
      </Container>
    </>
  )
}

export default StepAuthentication
