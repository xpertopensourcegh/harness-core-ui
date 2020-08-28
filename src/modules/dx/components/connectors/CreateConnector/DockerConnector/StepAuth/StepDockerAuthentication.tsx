import React, { useState } from 'react'
import {
  Layout,
  Button,
  Formik,
  FormInput,
  Text,
  SelectOption,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uikit'
import { Form } from 'formik'
import { buildDockerPayload } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import {
  useCreateConnector,
  ConnectorRequestDTORequestBody,
  usePostSecretText,
  useUpdateConnector,
  ConnectorConfigDTO,
  EncryptedDataDTO
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
  accountId: string
  projectIdentifier?: string
  orgIdentifier?: string
  previousStep?: () => void
  nextStep?: () => void
  formData?: ConnectorConfigDTO
  onConnectorCreated: (data: ConnectorConfigDTO) => void
  isEditMode: boolean
  setFormData: (val: ConnectorConfigDTO) => void
}

const StepDockerAuthentication: React.FC<StepDockerAuthenticationProps> = props => {
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const [editSecretData, setEditSecretData] = useState<EncryptedDataDTO>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: props.accountId })
  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: props.accountId })
  const { mutate: createSecret } = usePostSecretText({})
  // Todo: remove any once BE adds type of docker spec
  const handleCreate = async (data: any) => {
    try {
      await createConnector(data as ConnectorRequestDTORequestBody)
      props.nextStep?.()
    } catch (e) {
      modalErrorHandler?.showDanger(e?.message)
    }
  }

  const handleUpdate = async (data: any) => {
    try {
      await updateConnector(data as ConnectorRequestDTORequestBody)
      props.nextStep?.()
    } catch (error) {
      modalErrorHandler?.showDanger(error?.message)
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
          onSubmit={formData => {
            const connectorData = {
              ...props.formData,
              ...formData,
              projectIdentifier: props.projectIdentifier,
              orgIdentifier: props.orgIdentifier
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
                createSecret({
                  account: props.accountId,
                  org: props.orgIdentifier,
                  project: props.projectIdentifier,
                  identifier: formData.passwordRefSecret?.secretId,
                  name: formData.passwordRefSecret?.secretName,
                  secretManager: formData.passwordRefSecret?.secretManager?.value as string,
                  value: formData.passwordRef.name,
                  type: 'SecretText',
                  valueType: 'Inline'
                }).then(() => {
                  if (props.isEditMode) {
                    handleUpdate(data)
                  } else {
                    handleCreate(data)
                  }
                })
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
                  name={name}
                  isEditMode={props.isEditMode}
                  accountId={props.accountId}
                  orgIdentifier={props.orgIdentifier}
                  projectIdentifier={props.projectIdentifier}
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
                <Button type="submit" text={i18n.STEP_TWO.SAVE_CREDENTIALS_AND_CONTINUE} font="small" />
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
