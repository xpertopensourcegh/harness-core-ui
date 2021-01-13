import React, { useState, useEffect } from 'react'
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
  Color,
  Container
} from '@wings-software/uicore'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import {
  buildGitPayload,
  SecretReferenceInterface,
  setupGitFormData,
  GitConnectionType
} from '@connectors/pages/connectors/utils/ConnectorUtils'
import { useToaster } from '@common/exports'
import {
  useCreateConnector,
  useUpdateConnector,
  ConnectorConfigDTO,
  ConnectorRequestBody,
  ConnectorInfoDTO
} from 'services/cd-ng'

import SecretInput from '@secrets/components/SecretInput/SecretInput'
import { useStrings } from 'framework/exports'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import css from './StepGitAuthentication.module.scss'

interface StepGitAuthenticationProps extends ConnectorInfoDTO {
  name: string
  isEditMode?: boolean
}

interface GitAuthenticationProps {
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo: ConnectorInfoDTO | void
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
}

interface GitFormInterface {
  connectionType: string
  username: string
  password: SecretReferenceInterface | void
  sshKey: SecretReferenceInterface | void
}

const defaultInitialFormData: GitFormInterface = {
  connectionType: GitConnectionType.HTTPS,
  username: '',
  password: undefined,
  sshKey: undefined
}

const RenderGitAuthForm: React.FC<FormikProps<GitFormInterface>> = () => {
  const { getString } = useStrings()
  return (
    <>
      <FormInput.Text name="username" label={getString('username')} />
      <SecretInput name="password" label={getString('password')} />
    </>
  )
}

const StepGitAuthentication: React.FC<StepProps<StepGitAuthenticationProps> & GitAuthenticationProps> = props => {
  const { getString } = useStrings()
  const { showSuccess } = useToaster()
  const { prevStepData, nextStep, accountId, projectIdentifier, orgIdentifier } = props
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      const response = await createConnector(data)
      showSuccess(getString('connectors.successfullCreate', { name: data.connector?.name }))
      setLoadConnector(false)
      nextStep?.({ ...prevStepData, ...stepData } as StepGitAuthenticationProps)
      props.onConnectorCreated(response.data)
      props.setIsEditMode(true)
    } catch (e) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      const response = await updateConnector(data)
      showSuccess(getString('connectors.successfullUpdate', { name: data.connector?.name }))
      setLoadConnector(false)
      nextStep?.({ ...prevStepData, ...stepData } as StepGitAuthenticationProps)
      props.onConnectorCreated(response.data)
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (loadingConnectorSecrets) {
      if (props.isEditMode) {
        if (props.connectorInfo) {
          setupGitFormData(props.connectorInfo, accountId).then(data => {
            setInitialValues(data as GitFormInterface)
            setLoadingConnectorSecrets(false)
          })
        } else {
          setLoadingConnectorSecrets(false)
        }
      }
    }
  }, [loadingConnectorSecrets])

  return loadingConnectorSecrets ? (
    <PageSpinner />
  ) : (
    <Layout.Vertical height={'inherit'} spacing="medium" className={css.secondStep}>
      <Text font="medium" margin={{ top: 'small' }} color={Color.BLACK}>
        {getString('connectors.git.gitStepTwoName')}
      </Text>

      <Formik
        initialValues={{
          ...initialValues,
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().when('connectionType', {
            is: val => val === GitConnectionType.HTTPS,
            then: Yup.string().trim().required(getString('validation.username'))
          }),
          sshKey: Yup.object().when('connectionType', {
            is: val => val === GitConnectionType.SSH,
            then: Yup.object().required(getString('validation.sshKey')),
            otherwise: Yup.object().nullable()
          }),
          password: Yup.object().when('connectionType', {
            is: val => val === GitConnectionType.HTTPS,
            then: Yup.object().required(getString('validation.password')),
            otherwise: Yup.object().nullable()
          })
        })}
        onSubmit={stepData => {
          const connectorData = {
            ...prevStepData,
            ...stepData,
            projectIdentifier: projectIdentifier,
            orgIdentifier: orgIdentifier
          }
          const data = buildGitPayload(connectorData)

          if (props.isEditMode) {
            handleUpdate(data, stepData)
          } else {
            handleCreate(data, stepData)
          }
        }}
      >
        {formikProps => (
          <Form>
            <ModalErrorHandler bind={setModalErrorHandler} />
            <Container className={css.stepFormWrapper}>
              {formikProps.values.connectionType === GitConnectionType.SSH ? (
                <SecretInput name="sshKey" type="SSHKey" label={getString('SSH_KEY')} />
              ) : (
                <RenderGitAuthForm {...formikProps} />
              )}
            </Container>

            <Button
              type="submit"
              intent="primary"
              text={getString('saveAndContinue')}
              rightIcon="chevron-right"
              disabled={loadConnector}
            />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default StepGitAuthentication
