import React, { useState } from 'react'
import {
  StepWizard,
  Layout,
  Button,
  Text,
  FormInput,
  FormikForm,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uikit'
import { Formik } from 'formik'
import * as Yup from 'yup'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import {
  useCreateConnector,
  usePostSecretText,
  ConnectorConfigDTO,
  ConnectorDTO,
  EncryptedDataDTO
} from 'services/cd-ng'
import { AuthTypes, getSecretFieldsByType, SecretFieldByType } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import { Connectors } from 'modules/dx/constants'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import ConnectorFormFields from '../../ConnectorFormFields/ConnectorFormFields'
import i18n from './CreateAppDynamicsConnector.i18n'
import styles from './CreateAppDynamicsConnector.module.scss'

interface CreateAppDynamicsConnectorProps {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  hideLightModal: () => void
  onConnectorCreated?: (data: ConnectorDTO) => void | Promise<void>
}

export interface ConnectionConfigProps {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
  formData: ConnectorConfigDTO | undefined
  setFormData: (data: ConnectorConfigDTO | undefined) => void
  name: string
  previousStep?: () => void
  onSecretCreated: (data: ConnectorConfigDTO) => Promise<void>
}

export default function CreateAppDynamicsConnector(props: CreateAppDynamicsConnectorProps): JSX.Element {
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>({})
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: props.accountId })
  const secretCreatedCallback = async (data: ConnectorConfigDTO): Promise<void> => {
    const res = await createConnector({
      name: data.name,
      identifier: data.identifier,
      type: 'APP_DYNAMICS',
      projectIdentifier: props.projectIdentifier,
      orgIdentifier: props.orgIdentifier,
      spec: {
        username: data.username,
        accountname: data.accountName,
        passwordRef: `${data.passwordRefSecret.secretId}`,
        controllerUrl: data.url,
        accountId: props.accountId
      }
    })

    props.hideLightModal()
    if (res && res.status === 'SUCCESS' && props.onConnectorCreated && res.data) {
      await props.onConnectorCreated(res.data)
    }
  }

  return (
    <>
      <StepWizard>
        <ConnectorDetailsStep
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          type={Connectors.APP_DYNAMICS}
          name={i18n.connectorDetails}
          setFormData={setFormData}
          formData={formData}
        />
        <ConnectionConfigStep
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          name={i18n.connectionDetails}
          setFormData={setFormData}
          formData={formData}
          onSecretCreated={secretCreatedCallback}
        />
      </StepWizard>
      <Button text={i18n.close} />
    </>
  )
}

function ConnectionConfigStep(props: ConnectionConfigProps): JSX.Element {
  const { mutate: createSecret } = usePostSecretText({})
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [editSecretData, setEditSecretData] = useState<EncryptedDataDTO>()
  const isEdit = Boolean(props.formData?.passwordField)

  const handleFormSubmission = async (values: ConnectorConfigDTO, passwordField: SecretFieldByType): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      if (!values[passwordField.passwordField]?.isReference) {
        await createSecret({
          account: props.accountId,
          org: props.orgIdentifier,
          project: props.projectIdentifier,
          identifier: values[passwordField.secretField]?.secretId,
          name: values[passwordField.secretField]?.secretName,
          secretManager: values[passwordField.secretField]?.secretManager?.value as string,
          value: values[passwordField.passwordField]?.value,
          valueType: 'Inline',
          type: 'SecretText'
        })
      }
      const update = { ...props.formData, ...values }
      await props.onSecretCreated(update)
    } catch (error) {
      modalErrorHandler?.showDanger(error?.data?.message)
    }
  }

  return (
    <Formik
      initialValues={{
        url: props.formData?.url || '',
        accountName: props.formData?.accountname || '',
        username: props.formData?.username || '',
        passwordRef: props.formData?.passwordRef || '',
        passwordRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } }
      }}
      validationSchema={Yup.object().shape({
        url: Yup.string().trim().required(),
        accountName: Yup.string().trim().required(),
        username: Yup.string().trim().required(),
        passwordRef: Yup.string().trim().required()
      })}
      onSubmit={() => undefined}
    >
      {formikProps => (
        <FormikForm className={styles.connectionForm}>
          <ModalErrorHandler bind={setModalErrorHandler} />
          <Layout.Vertical spacing="large" className={styles.appDContainer}>
            <Text font="medium">{i18n.connectionDetailsHeader}</Text>
            <FormInput.Text label="Url" name="url" />
            <FormInput.Text label="Account Name" name="accountName" />
            <ConnectorFormFields
              accountId={props.accountId}
              isEditMode={isEdit}
              orgIdentifier={props.orgIdentifier || ''}
              projectIdentifier={props.projectIdentifier || ''}
              formikProps={formikProps}
              authType={AuthTypes.USER_PASSWORD}
              name={props.formData?.name}
              onEditSecret={val => {
                setEditSecretData(val)
                setShowCreateSecretModal(true)
              }}
              onClickCreateSecret={() => setShowCreateSecretModal(true)}
            />
          </Layout.Vertical>
          <Layout.Horizontal spacing="large">
            <Button onClick={() => props.previousStep?.()} text={i18n.back} />
            <Button
              onClick={async () => {
                formikProps.submitForm()
                const passwordField = getSecretFieldsByType(AuthTypes.USER_PASSWORD)?.[0]
                if (formikProps.isValid && passwordField) {
                  await handleFormSubmission(formikProps.values, passwordField)
                }
              }}
              style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }}
              text={i18n.connectAndSave}
            />
          </Layout.Horizontal>
          {showCreateSecretModal ? (
            <CreateSecretOverlay editSecretData={editSecretData} setShowCreateSecretModal={setShowCreateSecretModal} />
          ) : null}
        </FormikForm>
      )}
    </Formik>
  )
}
