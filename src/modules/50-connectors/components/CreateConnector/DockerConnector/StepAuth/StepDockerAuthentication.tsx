import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
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
import type { IOptionProps } from '@blueprintjs/core'
import {
  buildDockerPayload,
  SecretReferenceInterface,
  setupDockerFormData,
  DockerProviderType
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
import { AuthTypes } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import css from '../CreateDockerConnector.module.scss'

interface StepDockerAuthenticationProps extends ConnectorInfoDTO {
  name: string
  isEditMode?: boolean
}

interface DockerAuthenticationProps {
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  connectorInfo: ConnectorInfoDTO | void
}

interface DockerFormInterface {
  dockerRegistryUrl: string
  authType: string
  dockerProviderType: string
  username: string
  password: SecretReferenceInterface | void
}

const defaultInitialFormData: DockerFormInterface = {
  dockerRegistryUrl: '',
  authType: AuthTypes.USER_PASSWORD,
  dockerProviderType: DockerProviderType.DOCKERHUB,
  username: '',
  password: undefined
}

const StepDockerAuthentication: React.FC<
  StepProps<StepDockerAuthenticationProps> & DockerAuthenticationProps
> = props => {
  const { getString } = useStrings()
  const { showSuccess } = useToaster()
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  const authOptions: SelectOption[] = [
    {
      label: getString('usernamePassword'),
      value: AuthTypes.USER_PASSWORD
    },
    {
      label: getString('annonymous'),
      value: AuthTypes.ANNONYMOUS
    }
  ]

  const dockerProviderTypeOptions: IOptionProps[] = [
    {
      label: getString('connectors.docker.dockerHub'),
      value: DockerProviderType.DOCKERHUB
    },
    {
      label: getString('connectors.docker.harbour'),
      value: DockerProviderType.HARBOUR
    },
    {
      label: getString('connectors.docker.quay'),
      value: DockerProviderType.QUAY
    },
    {
      label: getString('connectors.docker.other'),
      value: DockerProviderType.OTHER
    }
  ]

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${prevStepData?.name}' created successfully`)
      nextStep?.({ ...prevStepData, ...stepData } as StepDockerAuthenticationProps)
    } catch (e) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await updateConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${prevStepData?.name}' updated successfully`)
      nextStep?.({ ...prevStepData, ...stepData } as StepDockerAuthenticationProps)
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (loadingConnectorSecrets) {
      if (props.isEditMode && props.connectorInfo) {
        setupDockerFormData(props.connectorInfo, accountId).then(data => {
          setInitialValues(data as DockerFormInterface)
          setLoadingConnectorSecrets(false)
        })
      }
    }
  }, [loadingConnectorSecrets])

  return loadingConnectorSecrets ? (
    <PageSpinner />
  ) : (
    <Layout.Vertical height={'inherit'} margin="small">
      <Text font="medium" margin={{ top: 'small' }} color={Color.BLACK}>
        {getString('connectors.docker.stepTwoName')}
      </Text>
      <Formik
        initialValues={{
          ...initialValues,
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          dockerRegistryUrl: Yup.string().trim().required(getString('validation.dockerRegistryUrl')),
          authType: Yup.string().trim().required(getString('validation.authType')),
          username: Yup.string().when('authType', {
            is: val => val === AuthTypes.USER_PASSWORD,
            then: Yup.string().trim().required(getString('validation.username')),
            otherwise: Yup.string().nullable()
          }),
          password: Yup.object().when('authType', {
            is: val => val === AuthTypes.USER_PASSWORD,
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
          const data = buildDockerPayload(connectorData)

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

            <Layout.Vertical padding={{ top: 'large', bottom: 'large' }} className={css.secondStep}>
              <FormInput.Text
                name="dockerRegistryUrl"
                placeholder={getString('UrlLabel')}
                label={getString('connectors.docker.dockerRegistryURL')}
              />
              <Text>{getString('connectors.docker.dockerProvideType')}</Text>
              <FormInput.RadioGroup
                className={css.dockerProviderType}
                inline
                name="dockerProviderType"
                radioGroup={{ inline: true }}
                items={dockerProviderTypeOptions}
                disabled={false}
              ></FormInput.RadioGroup>
              <Container className={css.authHeaderRow}>
                <Text className={css.authTitle} inline>
                  {getString('connectors.authTitle')}
                </Text>
                <FormInput.Select name="authType" items={authOptions} disabled={false} />
              </Container>
              {formikProps.values.authType === AuthTypes.USER_PASSWORD ? (
                <>
                  <FormInput.Text name="username" label={getString('username')} />
                  <SecretInput name={'password'} label={getString('password')} />
                </>
              ) : null}
            </Layout.Vertical>
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

export default StepDockerAuthentication
