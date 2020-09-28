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
  StepProps,
  Color
} from '@wings-software/uikit'
import * as Yup from 'yup'
import { buildDockerPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import { useToaster } from 'modules/common/exports'
import {
  useCreateConnector,
  useUpdateConnector,
  ConnectorConfigDTO,
  ConnectorRequestBody,
  usePostSecret,
  SecretDTOV2,
  ConnectorInfoDTO
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

interface StepDockerAuthenticationProps extends ConnectorInfoDTO {
  name: string
  isEditMode?: boolean
}

const StepDockerAuthentication: React.FC<StepProps<StepDockerAuthenticationProps>> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const [editSecretData, setEditSecretData] = useState<SecretDTOV2>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: createSecret } = usePostSecret({ queryParams: { accountIdentifier: accountId } })
  const [loadSecret, setLoadSecret] = useState(false)
  const [loadConnector, setLoadConnector] = useState(false)

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO) => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${prevStepData?.name}' created successfully`)
      nextStep?.({ ...prevStepData, ...stepData } as StepDockerAuthenticationProps)
    } catch (e) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO) => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await updateConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${prevStepData?.name}' updated successfully`)
      nextStep?.({ ...prevStepData, ...stepData } as StepDockerAuthenticationProps)
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  const createSecretCallback = async (stepData: ConnectorConfigDTO, data: ConnectorRequestBody) => {
    let res
    try {
      modalErrorHandler?.hide()
      setLoadSecret(true)
      res = await createSecret({
        secret: {
          type: 'SecretText',
          orgIdentifier: orgIdentifier,
          projectIdentifier: projectIdentifier,
          identifier: stepData.passwordRefSecret?.secretId,
          name: stepData.passwordRefSecret?.secretName,
          tags: {},
          spec: {
            value: stepData.passwordRef.value,
            valueType: 'Inline',
            secretManagerIdentifier: stepData.passwordRefSecret?.secretManager?.value as string
          }
        } as SecretDTOV2
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
        <Text font="medium" margin={{ top: 'small' }} color={Color.BLACK}>
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
            dockerRegistryUrl: Yup.string().trim().required(i18n.STEP_TWO.validation.dockerUrl)
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
              if (nonReferencedFields.length && stepData.passwordRef) {
                createSecretCallback(stepData, data)
              } else {
                handleCreate(data, stepData)
              }
            }
          }}
        >
          {formikProps => (
            <Form>
              <ModalErrorHandler bind={setModalErrorHandler} />

              <Layout.Vertical padding={{ top: 'large', bottom: 'large' }} width={'64%'} style={{ minHeight: '440px' }}>
                <FormInput.Text name="dockerRegistryUrl" label={i18n.STEP_TWO.DockerRegistryURL} />
                <UsernamePassword
                  formik={formikProps}
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
                  isOptional={true}
                />
              </Layout.Vertical>
              <Layout.Horizontal padding={{ top: 'small' }} spacing="medium">
                <Button
                  onClick={() => props.previousStep?.({ ...prevStepData } as StepDockerAuthenticationProps)}
                  text={i18n.STEP_TWO.BACK}
                />
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
