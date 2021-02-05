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
  Container,
  SelectOption
} from '@wings-software/uicore'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import {
  buildGitlabPayload,
  SecretReferenceInterface,
  setupGithubFormData,
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
import TextReference, { TextReferenceInterface, ValueType } from '@secrets/components/TextReference/TextReference'
import { useStrings } from 'framework/exports'
import { GitAuthTypes, GitAPIAuthTypes } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import css from './StepGitlabAuthentication.module.scss'

interface StepGitlabAuthenticationProps extends ConnectorInfoDTO {
  name: string
  isEditMode?: boolean
}

interface GitlabAuthenticationProps {
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo: ConnectorInfoDTO | void
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
}

interface GitlabFormInterface {
  connectionType: string
  authType: string
  username: TextReferenceInterface | void
  password: SecretReferenceInterface | void
  accessToken: SecretReferenceInterface | void
  installationId: string
  applicationId: string
  privateKey: SecretReferenceInterface | void
  sshKey: SecretReferenceInterface | void
  kerberosKey: SecretReferenceInterface | void
  apiAccessToken: SecretReferenceInterface | void
  enableAPIAccess: boolean
  apiAuthType: string
}

const defaultInitialFormData: GitlabFormInterface = {
  connectionType: GitConnectionType.HTTP,
  authType: GitAuthTypes.USER_PASSWORD,
  username: undefined,
  password: undefined,
  accessToken: undefined,
  installationId: '',
  applicationId: '',
  privateKey: undefined,
  sshKey: undefined,
  apiAccessToken: undefined,
  kerberosKey: undefined,
  enableAPIAccess: false,
  apiAuthType: GitAPIAuthTypes.TOKEN
}

const RenderGitlabAuthForm: React.FC<FormikProps<GitlabFormInterface>> = props => {
  const { getString } = useStrings()
  switch (props.values.authType) {
    case GitAuthTypes.USER_PASSWORD:
      return (
        <>
          <TextReference
            name="username"
            label={getString('username')}
            type={props.values.username ? props.values.username?.type : ValueType.TEXT}
          />
          <SecretInput name="password" label={getString('password')} />
        </>
      )
    case GitAuthTypes.USER_TOKEN:
      return (
        <>
          <TextReference
            name="username"
            label={getString('username')}
            type={props.values.username ? props.values.username?.type : ValueType.TEXT}
          />
          <SecretInput name="accessToken" label={getString('connectors.git.accessToken')} />
        </>
      )
    case GitAuthTypes.KERBEROS:
      return (
        <>
          <SecretInput name="kerberosKey" type={'SSHKey'} label={getString('kerberos')} />
        </>
      )
    default:
      return null
  }
}

const RenderAPIAccessForm: React.FC<FormikProps<GitlabFormInterface>> = props => {
  const { getString } = useStrings()
  switch (props.values.apiAuthType) {
    case GitAPIAuthTypes.TOKEN:
      return (
        <Container width={'52%'}>
          <SecretInput name="apiAccessToken" label={getString('connectors.git.accessToken')} />
        </Container>
      )
    default:
      return null
  }
}

const RenderAPIAccessFormWrapper: React.FC<FormikProps<GitlabFormInterface>> = formikProps => {
  const { getString } = useStrings()

  const apiAuthOptions: Array<SelectOption> = [
    {
      label: getString('connectors.git.accessToken'),
      value: GitAPIAuthTypes.TOKEN
    }
  ]

  return (
    <>
      <Text font="small" margin={{ bottom: 'small' }}>
        {getString('connectors.git.APIAccessDescriptipn')}
      </Text>
      <Container className={css.authHeaderRow} width={'52%'}>
        <Text className={css.authTitle} inline>
          {getString('connectors.git.APIAuthentication')}
        </Text>
        <FormInput.Select name="apiAuthType" items={apiAuthOptions} />
      </Container>
      <RenderAPIAccessForm {...formikProps} />{' '}
    </>
  )
}

const StepGitlabAuthentication: React.FC<
  StepProps<StepGitlabAuthenticationProps> & GitlabAuthenticationProps
> = props => {
  const { getString } = useStrings()
  const { showSuccess } = useToaster()
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = props
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  const authOptions: Array<SelectOption> = [
    {
      label: getString('usernamePassword'),
      value: GitAuthTypes.USER_PASSWORD
    },
    {
      label: getString('usernameToken'),
      value: GitAuthTypes.USER_TOKEN
    }
    // Disabling temp:
    // {
    //   label: getString('kerberos'),
    //   value: GitAuthTypes.KERBEROS
    // }
  ]

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      const response = await createConnector(data)
      showSuccess(getString('connectors.successfullCreate', { name: data.connector?.name }))
      setLoadConnector(false)
      nextStep?.({ ...prevStepData, ...stepData } as StepGitlabAuthenticationProps)
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
      nextStep?.({ ...prevStepData, ...stepData } as StepGitlabAuthenticationProps)
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
          setupGithubFormData(props.connectorInfo, accountId).then(data => {
            setInitialValues(data as GitlabFormInterface)
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
        {getString('details')}
      </Text>

      <Formik
        initialValues={{
          ...initialValues,
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().when(['connectionType', 'authType'], {
            is: (connectionType, authType) =>
              connectionType === GitConnectionType.HTTP && authType !== GitAuthTypes.KERBEROS,
            then: Yup.string().trim().required(getString('validation.username')),
            otherwise: Yup.string().nullable()
          }),
          authType: Yup.string().when('connectionType', {
            is: val => val === GitConnectionType.HTTP,
            then: Yup.string().trim().required(getString('validation.authType'))
          }),
          sshKey: Yup.object().when('connectionType', {
            is: val => val === GitConnectionType.SSH,
            then: Yup.object().required(getString('validation.sshKey')),
            otherwise: Yup.object().nullable()
          }),
          password: Yup.object().when(['connectionType', 'authType'], {
            is: (connectionType, authType) =>
              connectionType === GitConnectionType.HTTP && authType === GitAuthTypes.USER_PASSWORD,
            then: Yup.object().required(getString('validation.password')),
            otherwise: Yup.object().nullable()
          }),
          kerberosKey: Yup.object().when('authType', {
            is: val => val === GitAuthTypes.KERBEROS,
            then: Yup.object().required(getString('validation.kerberosKey')),
            otherwise: Yup.object().nullable()
          }),
          accessToken: Yup.object().when(['connectionType', 'authType'], {
            is: (connectionType, authType) =>
              connectionType === GitConnectionType.HTTP && authType === GitAuthTypes.USER_TOKEN,
            then: Yup.object().required(getString('validation.accessToken')),
            otherwise: Yup.object().nullable()
          }),
          apiAuthType: Yup.string().when('enableAPIAccess', {
            is: val => val,
            then: Yup.string().trim().required(getString('validation.authType'))
          }),
          apiAccessToken: Yup.object().when(['enableAPIAccess', 'apiAuthType'], {
            is: (enableAPIAccess, apiAuthType) => enableAPIAccess && apiAuthType === GitAPIAuthTypes.TOKEN,
            then: Yup.object().required(getString('validation.accessToken')),
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

          const data = buildGitlabPayload(connectorData)

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
                <Container width={'52%'}>
                  <Text font={{ weight: 'bold' }} className={css.authTitle}>
                    {getString('connectors.authTitle')}
                  </Text>
                  <SecretInput name="sshKey" type="SSHKey" label={getString('SSH_KEY')} />
                </Container>
              ) : (
                <Container width={'52%'}>
                  <Container className={css.authHeaderRow}>
                    <Text className={css.authTitle} inline>
                      {getString('connectors.authTitle')}
                    </Text>
                    <FormInput.Select name="authType" items={authOptions} disabled={false} />
                  </Container>

                  <RenderGitlabAuthForm {...formikProps} />
                </Container>
              )}

              <FormInput.CheckBox
                name="enableAPIAccess"
                label={getString('connectors.git.enableAPIAccess')}
                padding={{ left: 'xxlarge' }}
              />
              {formikProps.values.enableAPIAccess ? <RenderAPIAccessFormWrapper {...formikProps} /> : null}
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

export default StepGitlabAuthentication
