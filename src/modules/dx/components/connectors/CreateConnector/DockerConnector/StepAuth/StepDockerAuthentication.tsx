import React, { useState } from 'react'
import { useParams } from 'react-router'
import {
  Layout,
  Button,
  Formik,
  FormInput,
  Text,
  SelectOption,
  ModalErrorHandler,
  ModalErrorHandlerBinding,
  FormikForm as Form
} from '@wings-software/uikit'
import * as Yup from 'yup'
import { buildDockerPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import {
  useCreateConnector,
  ConnectorRequestDTORequestBody,
  usePostSecretText,
  useUpdateConnector,
  ConnectorConfigDTO,
  EncryptedDataDTO,
  ConnectorDTO
} from 'services/cd-ng'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import {
  AuthTypeFields,
  getSecretFieldsByType,
  SecretFieldByType
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import UsernamePassword from '../../../ConnectorFormFields/UsernamePassword'

import i18n from '../CreateDockerConnector.i18n'

interface StepDockerAuthenticationProps {
  name: string
  previousStep?: () => void
  nextStep?: () => void
  formData?: ConnectorConfigDTO
  onConnectorCreated?: (data: ConnectorConfigDTO) => void
  isEditMode: boolean
  setFormData: (val: ConnectorConfigDTO) => void
}

const StepDockerAuthentication: React.FC<StepDockerAuthenticationProps> = props => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const [editSecretData, setEditSecretData] = useState<EncryptedDataDTO>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: accountId })
  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: accountId })
  const { mutate: createSecret } = usePostSecretText({})
  const [loadSecret, setLoadSecret] = useState(false)
  const [loadConnector, setLoadConnector] = useState(false)

  // Todo: remove any once BE adds type of docker spec
  const handleCreate = async (data: any) => {
    try {
      setLoadConnector(true)
      await createConnector(data as ConnectorRequestDTORequestBody)
      setLoadConnector(false)
      props.nextStep?.()
    } catch (e) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(e?.message)
    }
  }

  const handleUpdate = async (data: any) => {
    try {
      setLoadConnector(true)
      await updateConnector(data as ConnectorRequestDTORequestBody)
      setLoadConnector(false)
      props.nextStep?.()
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error?.message)
    }
  }

  const createSecretCallback = async (formData: ConnectorConfigDTO, data: ConnectorDTO) => {
    let res
    try {
      modalErrorHandler?.hide()
      setLoadSecret(true)
      res = await createSecret({
        account: accountId,
        org: orgIdentifier,
        project: projectIdentifier,
        identifier: formData.passwordRefSecret?.secretId,
        name: formData.passwordRefSecret?.secretName,
        secretManager: formData.passwordRefSecret?.secretManager?.value as string,
        value: formData.passwordRef.value,
        type: 'SecretText',
        valueType: 'Inline'
      })
      setLoadSecret(false)
    } catch (e) {
      setLoadSecret(false)
      modalErrorHandler?.showDanger(e?.message)
    }

    if (res && res.status === 'SUCCESS' && res.data) {
      if (props.isEditMode) {
        handleUpdate(data)
      } else {
        handleCreate(data)
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
            passwordRef: { name: '', isReference: false },
            dockerRegistryUrl: '',
            passwordRefSecret: {
              secretId: '',
              secretName: '',
              secretManager: { value: '' } as SelectOption
            },
            ...props.formData
          }}
          validationSchema={Yup.object().shape({
            dockerRegistryUrl: Yup.string().trim().required(i18n.STEP_TWO.validation.dockerUrl),
            username: Yup.string().trim().required(i18n.STEP_TWO.validation.username)
          })}
          onSubmit={formData => {
            const connectorData = {
              ...props.formData,
              ...formData,
              projectIdentifier: projectIdentifier,
              orgIdentifier: orgIdentifier
            }
            const data = buildDockerPayload(connectorData)
            const passwordFields = getSecretFieldsByType('UsernamePassword') || []
            const nonReferencedFields = passwordFields
              .map((item: SecretFieldByType) => {
                if (!connectorData.passwordRef.isReference) {
                  return item
                }
              })
              .filter(item => {
                if (item !== undefined) {
                  return item
                }
              })
            if (props.isEditMode) {
              handleUpdate(data)
            } else {
              if (nonReferencedFields.length) {
                createSecretCallback(formData, data)
              } else {
                handleCreate(data)
              }
            }
            props.setFormData(connectorData)
          }}
        >
          {formikProps => (
            <Form>
              <ModalErrorHandler bind={setModalErrorHandler} />
              <Layout.Vertical padding={{ top: 'large', bottom: 'large' }} width={'64%'}>
                <FormInput.Text name="dockerRegistryUrl" label={i18n.STEP_TWO.DockerRegistryURL} />
                <UsernamePassword
                  name={props.formData?.identifier}
                  isEditMode={props.isEditMode}
                  accountId={accountId}
                  orgIdentifier={orgIdentifier}
                  projectIdentifier={projectIdentifier}
                  formikProps={formikProps}
                  passwordField={AuthTypeFields.passwordRef}
                  onClickCreateSecret={() => setShowCreateSecretModal(true)}
                  onEditSecret={val => {
                    setShowCreateSecretModal(true)
                    setEditSecretData(val)
                  }}
                />
              </Layout.Vertical>
              <Layout.Horizontal padding={{ top: 'small' }}>
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
