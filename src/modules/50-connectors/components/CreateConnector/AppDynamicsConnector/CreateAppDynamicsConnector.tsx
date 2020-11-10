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
import { useToaster } from '@common/exports'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import {
  useCreateConnector,
  ConnectorConfigDTO,
  ConnectorRequestBody,
  Connector,
  useUpdateConnector,
  ResponseBoolean
} from 'services/cd-ng'

import { Connectors } from '@connectors/constants'

import SecretInput from '@secrets/components/SecretInput/SecretInput'
import i18n from './CreateAppDynamicsConnector.i18n'
import styles from './CreateAppDynamicsConnector.module.scss'

interface CreateAppDynamicsConnectorProps {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  hideLightModal: () => void
  onConnectorCreated?: (data: ConnectorRequestBody) => void | Promise<void>
  mockIdentifierValidate?: ResponseBoolean
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
  handleCreate: (data: ConnectorConfigDTO) => Promise<void>
  handleUpdate: (data: ConnectorConfigDTO) => Promise<void>
  isEditMode: boolean
}

export default function CreateAppDynamicsConnector(props: CreateAppDynamicsConnectorProps): JSX.Element {
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>({})
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: props.accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: props.accountId } })
  const [connectorResponse, setConnectorResponse] = useState<Connector | undefined>()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const { showSuccess } = useToaster()
  const handleCreate = async (data: ConnectorConfigDTO): Promise<void> => {
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
          passwordRef: data.password.referenceString,
          controllerUrl: data.url,
          accountId: props.accountId
        }
      }
    })
    if (res && res.status === 'SUCCESS') {
      showSuccess(i18n.showSuccessCreated(data?.name || ''))
      setConnectorResponse(res.data)
    } else {
      throw new Error(i18n.errorCreate)
    }
  }

  const handleUpdate = async (data: ConnectorConfigDTO): Promise<void> => {
    const res = await updateConnector({
      connector: {
        name: data.name,
        identifier: data.identifier,
        type: 'AppDynamics',
        projectIdentifier: props.projectIdentifier,
        orgIdentifier: props.orgIdentifier,
        spec: {
          username: data.username,
          accountname: data.accountName,
          passwordRef: data.password.referenceString,
          controllerUrl: data.url,
          accountId: props.accountId
        }
      }
    })
    if (res && res.status === 'SUCCESS') {
      showSuccess(i18n.showSuccessUpdated(data?.name || ''))
      setConnectorResponse(res.data)
    } else {
      throw new Error(i18n.errorCreate)
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
          mock={props.mockIdentifierValidate}
        />
        <ConnectionConfigStep
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          name={i18n.wizardStepName.credentials}
          setFormData={setFormData}
          formData={formData}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          isEditMode={isEditMode}
        />
        <VerifyOutOfClusterDelegate
          name={i18n.verifyConnection}
          connectorName={formData?.name}
          connectorIdentifier={formData?.identifier}
          onSuccess={() => props.onConnectorCreated?.((connectorResponse as unknown) as ConnectorRequestBody)}
          renderInModal
          isLastStep
          type={Connectors.APP_DYNAMICS}
          setIsEditMode={() => setIsEditMode(true)}
        />
      </StepWizard>
    </>
  )
}

function ConnectionConfigStep(props: ConnectionConfigProps): JSX.Element {
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const handleFormSubmission = async (formData: ConnectorConfigDTO) => {
    modalErrorHandler?.hide()
    if (props.isEditMode) {
      try {
        await props.handleUpdate(formData)
        props.nextStep?.()
      } catch (error) {
        modalErrorHandler?.showDanger(error?.data?.message)
      }
    } else {
      try {
        await props.handleCreate(formData)
        props.nextStep?.()
      } catch (error) {
        modalErrorHandler?.showDanger(error?.data?.message)
      }
    }
  }
  return (
    <Formik
      initialValues={{
        url: props.formData?.url || '',
        accountName: props.formData?.accountname || '',
        username: props.formData?.username || '',
        password: props.formData?.password || '',
        ...props.formData
      }}
      validationSchema={Yup.object().shape({
        url: Yup.string().trim().required(),
        accountName: Yup.string().trim().required(),
        username: Yup.string().trim().required(),
        password: Yup.string().trim().required()
      })}
      onSubmit={formData => {
        props.setFormData(formData)
        handleFormSubmission(formData)
      }}
    >
      {() => (
        <FormikForm className={styles.connectionForm}>
          <ModalErrorHandler bind={setModalErrorHandler} />
          <Layout.Vertical spacing="large" className={styles.appDContainer}>
            <Text font="medium">{i18n.connectionDetailsHeader}</Text>
            <FormInput.Text label={i18n.Url} name="url" />
            <FormInput.Text label={i18n.accountName} name="accountName" />
            <FormInput.Text name="username" label={i18n.Username} />
            <SecretInput name="password" label={i18n.Password} />
          </Layout.Vertical>
          <Layout.Horizontal spacing="large">
            <Button onClick={() => props.previousStep?.()} text={i18n.back} />
            <Button type="submit" text={i18n.connectAndSave} />
          </Layout.Horizontal>
        </FormikForm>
      )}
    </Formik>
  )
}
