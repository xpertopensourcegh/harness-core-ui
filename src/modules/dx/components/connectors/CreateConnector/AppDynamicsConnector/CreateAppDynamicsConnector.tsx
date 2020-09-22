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
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import {
  useCreateConnector,
  usePostSecret,
  ConnectorConfigDTO,
  ConnectorRequestWrapper,
  ConnectorWrapper,
  SecretDTOV2
} from 'services/cd-ng'
import {
  AuthTypeFields,
  getSecretFieldsByType,
  SecretFieldByType
} from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import { Connectors } from 'modules/dx/constants'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import { AuthTypes } from 'modules/dx/pages/connectors/Forms/KubeFormInterfaces'
import UsernamePassword from '../../ConnectorFormFields/UsernamePassword'
import i18n from './CreateAppDynamicsConnector.i18n'
import { getScopingStringFromSecretRef } from '../CreateConnectorUtils'
import styles from './CreateAppDynamicsConnector.module.scss'

interface CreateAppDynamicsConnectorProps {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  hideLightModal: () => void
  onConnectorCreated?: (data: ConnectorRequestWrapper) => void | Promise<void>
}

export interface ConnectionConfigProps {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
  formData: ConnectorConfigDTO | undefined
  setFormData: (data: ConnectorConfigDTO | undefined) => void
  name: string
  previousStep?: () => void
  nextStep?: () => void
  onSecretCreated: (data: ConnectorConfigDTO) => Promise<void>
}

export default function CreateAppDynamicsConnector(props: CreateAppDynamicsConnectorProps): JSX.Element {
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>({})
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: props.accountId })
  const [connectorResponse, setConnectorResponse] = useState<ConnectorWrapper | undefined>()
  const secretCreatedCallback = async (data: ConnectorConfigDTO): Promise<void> => {
    const res = await createConnector({
      connector: {
        name: data.name,
        identifier: data.identifier,
        type: 'AppDynamics',
        projectIdentifier: props.projectIdentifier,
        orgIdentifier: props.orgIdentifier,
        spec: {
          username: data.username,
          accountname: data.accountName,
          passwordRef: `${getScopingStringFromSecretRef(data) ?? ''}${data.passwordRefSecret.secretId}`,
          controllerUrl: data.url,
          accountId: props.accountId
        }
      }
    })
    if (res && res.status === 'SUCCESS') {
      setConnectorResponse(res.data)
    } else {
      throw new Error('Unable to create connector')
    }
  }

  return (
    <>
      <StepWizard>
        <ConnectorDetailsStep
          type={Connectors.APP_DYNAMICS}
          name={i18n.wizardStepName.connectorDetails}
          setFormData={setFormData}
          formData={formData}
        />
        <ConnectionConfigStep
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          name={i18n.wizardStepName.credentials}
          setFormData={setFormData}
          formData={formData}
          onSecretCreated={secretCreatedCallback}
        />
        <VerifyOutOfClusterDelegate
          name={i18n.verifyConnection}
          connectorName={formData?.name}
          connectorIdentifier={formData?.identifier}
          onSuccess={() => props.onConnectorCreated?.((connectorResponse as unknown) as ConnectorRequestWrapper)}
          renderInModal
          isLastStep
          type={Connectors.APP_DYNAMICS}
        />
      </StepWizard>
      <Button text={i18n.close} />
    </>
  )
}

function ConnectionConfigStep(props: ConnectionConfigProps): JSX.Element {
  const { mutate: createSecret } = usePostSecret({ queryParams: { accountIdentifier: props.accountId } })
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [editSecretData, setEditSecretData] = useState<SecretDTOV2>()
  const isEdit = Boolean(props.formData?.passwordField)

  const handleFormSubmission = async (values: ConnectorConfigDTO, passwordField: SecretFieldByType): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      if (!values[passwordField.passwordField]?.isReference) {
        await createSecret({
          type: 'SecretText',
          orgIdentifier: props.orgIdentifier,
          projectIdentifier: props.projectIdentifier,
          identifier: values[passwordField.secretField]?.secretId,
          name: values[passwordField.secretField]?.secretName,
          tags: {},
          spec: {
            value: values[passwordField.passwordField]?.value,
            valueType: 'Inline',
            secretManagerIdentifier: values[passwordField.secretField]?.secretManager?.value as string
          }
        } as SecretDTOV2)
      }
      const update = { ...props.formData, ...values }
      await props.onSecretCreated(update)
      props.nextStep?.()
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
            <UsernamePassword
              accountId={props.accountId}
              isEditMode={isEdit}
              orgIdentifier={props.orgIdentifier || ''}
              projectIdentifier={props.projectIdentifier || ''}
              passwordField={AuthTypeFields.passwordRef}
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
