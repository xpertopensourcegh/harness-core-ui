import React, { useState, useEffect } from 'react'
import {
  StepWizard,
  StepProps,
  Layout,
  Button,
  Text,
  FormInput,
  FormikForm,
  ModalErrorHandler,
  ModalErrorHandlerBinding
} from '@wings-software/uicore'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useToaster } from '@common/exports'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import {
  useCreateConnector,
  ConnectorConfigDTO,
  ConnectorInfoDTO,
  ConnectorRequestBody,
  ResponseBoolean,
  useUpdateConnector
} from 'services/cd-ng'
import { setSecretField } from '@connectors/pages/connectors/utils/ConnectorUtils'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import i18n from './CreateAppDynamicsConnector.i18n'
import styles from './CreateAppDynamicsConnector.module.scss'

interface CreateAppDynamicsConnectorProps extends CreateConnectorModalProps {
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  mockIdentifierValidate?: ResponseBoolean
}

export interface ConnectionConfigProps extends StepProps<ConnectorConfigDTO> {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
  handleCreate: (data: ConnectorConfigDTO) => Promise<ConnectorInfoDTO | undefined>
  handleUpdate: (data: ConnectorConfigDTO) => Promise<ConnectorInfoDTO | undefined>
  isEditMode: boolean
  connectorInfo?: ConnectorInfoDTO | void
}

export default function CreateAppDynamicsConnector(props: CreateAppDynamicsConnectorProps): JSX.Element {
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: props.accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: props.accountId } })
  const { showSuccess } = useToaster()
  const [successfullyCreated, setSuccessfullyCreated] = useState(false)
  const handleCreate = async (data: ConnectorConfigDTO): Promise<ConnectorInfoDTO | undefined> => {
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
      if (res.data) {
        setSuccessfullyCreated(true)
        props.onConnectorCreated?.(res.data)
        props.onSuccess?.(res.data)
      }
    } else {
      throw new Error(i18n.errorCreate)
    }
    return res.data?.connector
  }

  const handleUpdate = async (data: ConnectorConfigDTO): Promise<ConnectorInfoDTO | undefined> => {
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
      if (res.data) {
        props.onConnectorCreated?.(res.data)
        props.onSuccess?.(res.data)
      }
    } else {
      throw new Error(i18n.errorCreate)
    }
    return res.data?.connector
  }

  const isEditMode = props.isEditMode || successfullyCreated

  return (
    <>
      <StepWizard>
        <ConnectorDetailsStep
          type={Connectors.APP_DYNAMICS}
          name={i18n.wizardStepName.connectorDetails}
          isEditMode={isEditMode}
          connectorInfo={props.connectorInfo}
          mock={props.mockIdentifierValidate}
        />
        <ConnectionConfigStep
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          name={i18n.wizardStepName.credentials}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          isEditMode={isEditMode}
          connectorInfo={props.connectorInfo}
        />
        <VerifyOutOfClusterDelegate
          name={i18n.verifyConnection}
          onClose={props.onClose}
          isStep
          isLastStep
          type={Connectors.APP_DYNAMICS}
          setIsEditMode={props.setIsEditMode}
        />
      </StepWizard>
    </>
  )
}

function ConnectionConfigStep(props: ConnectionConfigProps): JSX.Element {
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [loadingSecrets, setLoadingSecrets] = useState(props.isEditMode)
  const [initialValues, setInitialValues] = useState<ConnectorConfigDTO>({
    url: '',
    accountName: '',
    username: '',
    password: undefined
  })

  useEffect(() => {
    ;(async () => {
      if (props.isEditMode) {
        setInitialValues({
          url: props.prevStepData?.spec?.controllerUrl || '',
          accountName: props.prevStepData?.spec?.accountname || '',
          username: props.prevStepData?.spec?.username || '',
          password: await setSecretField((props.connectorInfo as ConnectorInfoDTO)?.spec?.passwordRef, {
            accountIdentifier: props.accountId,
            projectIdentifier: props.projectIdentifier,
            orgIdentifier: props.orgIdentifier
          })
        })
        setLoadingSecrets(false)
      }
    })()
  }, [])

  const handleFormSubmission = async (formData: ConnectorConfigDTO) => {
    modalErrorHandler?.hide()
    if (props.isEditMode) {
      try {
        const res = await props.handleUpdate(formData)
        props.nextStep?.({ ...(res || {}), ...formData })
      } catch (error) {
        modalErrorHandler?.showDanger(error?.data?.message)
      }
    } else {
      try {
        const res = await props.handleCreate(formData)
        props.nextStep?.({ ...(res || {}), ...formData })
      } catch (error) {
        modalErrorHandler?.showDanger(error?.data?.message)
      }
    }
  }

  if (loadingSecrets) {
    return <PageSpinner />
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...initialValues,
        ...props.prevStepData
      }}
      validationSchema={Yup.object().shape({
        url: Yup.string().trim().required(),
        accountName: Yup.string().trim().required(),
        username: Yup.string().trim().required(),
        password: Yup.string().trim().required()
      })}
      onSubmit={formData => {
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
            <Button onClick={() => props.previousStep?.({ ...props.prevStepData })} text={i18n.back} />
            <Button type="submit" text={i18n.connectAndSave} />
          </Layout.Horizontal>
        </FormikForm>
      )}
    </Formik>
  )
}
