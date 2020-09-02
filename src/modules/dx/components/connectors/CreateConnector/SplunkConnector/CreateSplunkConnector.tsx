import React, { useState } from 'react'
import {
  Layout,
  Button,
  Text,
  StepWizard,
  FormInput,
  FormikForm,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uikit'
import { Formik } from 'formik'
import * as Yup from 'yup'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import { useCreateConnector, ConnectorConfigDTO, usePostSecretText, EncryptedDataDTO } from 'services/cd-ng'
import { Connectors } from 'modules/dx/constants'
import { AuthTypes, getSecretFieldsByType, SecretFieldByType } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import CreateSecretOverlay from 'modules/dx/common/CreateSecretOverlay/CreateSecretOverlay'
import i18n from './CreateSplunkConnector.i18n'
import ConnectorFormFields from '../../ConnectorFormFields/ConnectorFormFields'
import css from '../../CreateConnector/AppDynamicsConnector/CreateAppDynamicsConnector.module.scss'

interface CreateSplunkConnectorProps {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  hideLightModal: () => void
  onConnectorCreated?: (data: ConnectorConfigDTO) => void | Promise<void>
}
interface ConnectionConfigProps {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
  formData: ConnectorConfigDTO | undefined
  setFormData: (data: ConnectorConfigDTO | undefined) => void
  name: string
  previousStep?: () => void
  onSecretCreated: (data: ConnectorConfigDTO) => Promise<void>
}

export default function CreateSplunkConnector(props: CreateSplunkConnectorProps): JSX.Element {
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>()
  const { mutate: createConnector } = useCreateConnector({ accountIdentifier: props.accountId })
  const secretCreatedCallback = async (data: ConnectorConfigDTO): Promise<void> => {
    const res = await createConnector({
      name: data.name,
      identifier: data.identifier,
      type: 'Splunk',
      projectIdentifier: props.projectIdentifier,
      orgIdentifier: props.orgIdentifier,
      spec: {
        username: data.username,
        accountname: data.accountName,
        passwordRef: `${data.passwordRefSecret.secretId}`,
        splunkUrl: data.url,
        accountId: props.accountId
      }
    })

    props.hideLightModal()
    if (res && res.status === 'SUCCESS' && props.onConnectorCreated && res.data) {
      props.onConnectorCreated(res.data)
    }
  }

  return (
    <>
      <StepWizard>
        <ConnectorDetailsStep
          type={Connectors.SPLUNK}
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
      </StepWizard>
      <Button text={i18n.close} />
    </>
  )
}

export function ConnectionConfigStep(props: ConnectionConfigProps): JSX.Element {
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
        username: props.formData?.username || '',
        passwordRef: props.formData?.passwordRef || '',
        passwordRefSecret: { secretId: '', secretName: '', secretManager: { value: '' } }
      }}
      validationSchema={Yup.object().shape({
        url: Yup.string().trim().required(),
        username: Yup.string().trim().required(),
        passwordRef: Yup.string().trim().required()
      })}
      onSubmit={() => undefined}
    >
      {formikProps => (
        <FormikForm className={css.connectionForm}>
          <ModalErrorHandler bind={setModalErrorHandler} />
          <Layout.Vertical spacing="large" className={css.appDContainer}>
            <Text font="medium">{i18n.connectionDetailsHeader}</Text>
            <FormInput.Text label="Url" name="url" />
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
