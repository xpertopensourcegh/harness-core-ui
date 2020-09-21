import React, { useState } from 'react'
import { useParams } from 'react-router'
import {
  Layout,
  Button,
  Formik,
  FormInput,
  Text,
  ModalErrorHandler,
  ModalErrorHandlerBinding,
  FormikForm as Form,
  StepProps
} from '@wings-software/uikit'
import * as Yup from 'yup'
import { buildDockerPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import { useToaster } from 'modules/common/exports'
import {
  useCreateConnector,
  usePostSecretText,
  useUpdateConnector,
  ConnectorConfigDTO,
  EncryptedDataDTO,
  ConnectorRequestWrapper
} from 'services/cd-ng'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import {
  AuthTypeFields,
  getSecretFieldsByType,
  SecretFieldByType
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import type { SecretInfo } from 'modules/dx/components/SecretInput/SecretTextInput'
import UsernamePassword from '../../../ConnectorFormFields/UsernamePassword'

import i18n from '../CreateDockerConnector.i18n'

interface StepDockerAuthenticationProps extends ConnectorConfigDTO {
  name?: string
  isEditMode?: boolean
}

const StepDockerAuthentication: React.FC<StepProps<StepDockerAuthenticationProps>> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const [editSecretData, setEditSecretData] = useState<EncryptedDataDTO>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: accountId })
  const { mutate: createSecret } = usePostSecretText({})
  const [loadSecret, setLoadSecret] = useState(false)
  const [loadConnector, setLoadConnector] = useState(false)

  const handleCreate = async (data: ConnectorRequestWrapper, stepData: ConnectorConfigDTO) => {
    try {
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      nextStep?.({ ...prevStepData, ...stepData })
      showSuccess(`Connector '${prevStepData?.name}' created successfully`)
    } catch (e) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestWrapper, stepData: ConnectorConfigDTO) => {
    try {
      setLoadConnector(true)
      await updateConnector(data)
      setLoadConnector(false)
      nextStep?.({ ...prevStepData, ...stepData })
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  const createSecretCallback = async (stepData: ConnectorConfigDTO, data: ConnectorRequestWrapper) => {
    let res
    try {
      modalErrorHandler?.hide()
      setLoadSecret(true)
      res = await createSecret({
        account: accountId,
        org: orgIdentifier,
        project: projectIdentifier,
        identifier: stepData.passwordRefSecret?.secretId,
        name: stepData.passwordRefSecret?.secretName,
        secretManager: stepData.passwordRefSecret?.secretManager?.value as string,
        value: stepData.passwordRef.value,
        type: 'SecretText',
        valueType: 'Inline'
      })
      setLoadSecret(false)
    } catch (e) {
      setLoadSecret(false)
      modalErrorHandler?.showDanger(e?.data?.message || e?.message)
    }

    if (res && res.status === 'SUCCESS' && res.data) {
      if (prevStepData?.isEditMode) {
        handleUpdate(data, stepData)
      } else {
        handleCreate(data, stepData)
      }
    }
  }

  return (
    <>
      <Layout.Vertical height={'inherit'}>
        <Text font="medium" margin={{ top: 'small', left: 'small' }} color="var(--grey-800)">
          {i18n.STEP_TWO.Heading}
        </Text>
        <Formik
          initialValues={{
            username: '',
            passwordRef: undefined,
            dockerRegistryUrl: '',
            ...prevStepData
          }}
          validationSchema={Yup.object().shape({
            dockerRegistryUrl: Yup.string().trim().required(i18n.STEP_TWO.validation.dockerUrl),
            username: Yup.string().trim().required(i18n.STEP_TWO.validation.username),
            passwordRef: Yup.string().trim().required(i18n.STEP_TWO.validation.passwordRef)
          })}
          onSubmit={stepData => {
            const connectorData = {
              ...prevStepData,
              ...stepData,
              projectIdentifier: projectIdentifier,
              orgIdentifier: orgIdentifier
            }
            const data = buildDockerPayload(connectorData)
            const passwordFields = getSecretFieldsByType('UsernamePassword') || []
            const nonReferencedFields = passwordFields
              .map((item: SecretFieldByType) => {
                if (!((connectorData.passwordRef as unknown) as SecretInfo)?.isReference) {
                  return item
                }
              })
              .filter(item => {
                if (item !== undefined) {
                  return item
                }
              })
            if (prevStepData?.isEditMode) {
              handleUpdate(data, stepData)
            } else {
              if (nonReferencedFields.length) {
                createSecretCallback(stepData, data)
              } else {
                handleCreate(data, stepData)
              }
            }
          }}
        >
          {() => (
            <Form>
              <ModalErrorHandler bind={setModalErrorHandler} />
              <Layout.Vertical padding={{ top: 'large', bottom: 'large' }} width={'64%'}>
                <FormInput.Text name="dockerRegistryUrl" label={i18n.STEP_TWO.DockerRegistryURL} />
                <UsernamePassword
                  name={prevStepData?.identifier}
                  isEditMode={prevStepData?.isEditMode}
                  accountId={accountId}
                  orgIdentifier={orgIdentifier}
                  projectIdentifier={projectIdentifier}
                  passwordField={AuthTypeFields.passwordRef}
                  onClickCreateSecret={() => setShowCreateSecretModal(true)}
                  onEditSecret={val => {
                    setShowCreateSecretModal(true)
                    setEditSecretData(val)
                  }}
                />
              </Layout.Vertical>
              <Layout.Horizontal padding={{ top: 'small' }} spacing="medium">
                <Button onClick={() => props.previousStep?.({ ...prevStepData })} text={i18n.STEP_TWO.BACK} />
                <Button
                  type="submit"
                  text={i18n.STEP_TWO.SAVE_CREDENTIALS_AND_CONTINUE}
                  font="small"
                  disabled={loadSecret || loadConnector}
                />
              </Layout.Horizontal>
            </Form>
          )}
        </Formik>
      </Layout.Vertical>
      {showCreateSecretModal ? (
        <CreateSecretOverlay editSecretData={editSecretData} setShowCreateSecretModal={setShowCreateSecretModal} />
      ) : null}
    </>
  )
}

export default StepDockerAuthentication
