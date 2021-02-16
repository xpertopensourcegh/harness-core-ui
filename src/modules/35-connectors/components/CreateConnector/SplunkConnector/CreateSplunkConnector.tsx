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
} from '@wings-software/uicore'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useToaster } from '@common/exports'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import {
  useCreateConnector,
  ConnectorConfigDTO,
  ConnectorInfoDTO,
  ConnectorRequestBody,
  useUpdateConnector,
  ResponseBoolean
} from 'services/cd-ng'
import { Connectors } from '@connectors/constants'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import i18n from './CreateSplunkConnector.i18n'
import css from '../AppDynamicsConnector/CreateAppDynamicsConnector.module.scss'

interface CreateSplunkConnectorProps {
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  onClose: () => void
  onConnectorCreated?: (data: ConnectorConfigDTO) => void | Promise<void>
  mockIdentifierValidate?: ResponseBoolean
}
interface ConnectionConfigProps {
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

export default function CreateSplunkConnector(props: CreateSplunkConnectorProps): JSX.Element {
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: props.accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: props.accountId } })
  const [connectorResponse, setConnectorResponse] = useState<ConnectorRequestBody | undefined>()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const { showSuccess } = useToaster()

  const handleCreate = async (data: ConnectorConfigDTO): Promise<void> => {
    const res = await createConnector({
      connector: {
        name: data.name,
        identifier: data.identifier,
        type: 'Splunk',
        projectIdentifier: props.projectIdentifier,
        orgIdentifier: props.orgIdentifier,
        spec: {
          username: data.username,
          accountname: data.accountName,
          passwordRef: data.passwordRef.referenceString,
          splunkUrl: data.url,
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
        type: 'Splunk',
        projectIdentifier: props.projectIdentifier,
        orgIdentifier: props.orgIdentifier,
        spec: {
          username: data.username,
          accountname: data.accountName,
          passwordRef: data.passwordRef.referenceString,
          splunkUrl: data.url,
          accountId: props.accountId
        }
      }
    })
    if (res && res.status === 'SUCCESS') {
      showSuccess(i18n.showSuccessUpdated(data?.name || ''))
      setConnectorResponse(res.data)
    } else {
      throw new Error(i18n.errorUpdate)
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
          url={formData?.url}
          connectorIdentifier={formData?.identifier}
          onClose={() => props.onConnectorCreated?.(connectorResponse as ConnectorInfoDTO)}
          isStep
          isLastStep
          type={Connectors.SPLUNK}
          setIsEditMode={() => setIsEditMode(true)}
        />
      </StepWizard>
    </>
  )
}

export function ConnectionConfigStep(props: ConnectionConfigProps): JSX.Element {
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
        username: props.formData?.username || '',
        passwordRef: props.formData?.passwordRef || '',
        ...props.formData
      }}
      validationSchema={Yup.object().shape({
        url: Yup.string().trim().required(),
        username: Yup.string().trim().required(),
        passwordRef: Yup.string().trim().required()
      })}
      onSubmit={formData => {
        props.setFormData(formData)
        handleFormSubmission(formData)
      }}
    >
      {() => (
        <FormikForm className={css.connectionForm}>
          <ModalErrorHandler bind={setModalErrorHandler} />
          <Layout.Vertical spacing="large" className={css.appDContainer}>
            <Text font="medium">{i18n.connectionDetailsHeader}</Text>
            <FormInput.Text label={i18n.Url} name="url" />
            <FormInput.Text name="username" label={i18n.Username} />
            <SecretInput name="passwordRef" label={i18n.Password} />
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
