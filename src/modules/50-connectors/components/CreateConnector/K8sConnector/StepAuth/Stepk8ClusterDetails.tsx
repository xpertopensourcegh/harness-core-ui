import {
  StepProps,
  Layout,
  Color,
  Text,
  CardSelect,
  Icon,
  Container,
  FormInput,
  Formik,
  FormikForm as Form,
  Button,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import {
  ConnectorInfoDTO,
  ConnectorRequestBody,
  useCreateConnector,
  useUpdateConnector,
  ConnectorConfigDTO
} from 'services/cd-ng'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import {
  buildKubPayload,
  DelegateTypes,
  setupKubFormData,
  SecretReferenceInterface,
  DelegateCardInterface
} from '@connectors/pages/connectors/utils/ConnectorUtils'
import { useToaster } from '@common/components/Toaster/useToaster'
import { useStrings } from 'framework/exports'
import { AuthTypes } from '@connectors/pages/connectors/utils/ConnectorHelper'
import TextReference, { ValueType, TextReferenceInterface } from '@secrets/components/TextReference/TextReference'
import css from './Stepk8ClusterDetails.module.scss'

interface Stepk8ClusterDetailsProps extends ConnectorInfoDTO {
  name: string
}

interface K8ClusterDetailsProps {
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo: ConnectorInfoDTO | void
}

interface KubeFormInterface {
  delegateType: string
  authType: string
  username: TextReferenceInterface | void
  password: SecretReferenceInterface | void
  serviceAccountToken: SecretReferenceInterface | void
  oidcIssuerUrl: string
  oidcUsername: TextReferenceInterface | void
  oidcPassword: SecretReferenceInterface | void
  oidcCleintId: SecretReferenceInterface | void
  oidcCleintSecret: SecretReferenceInterface | void
  oidcScopes: string
  clientKey: SecretReferenceInterface | void
  clientKeyPassphrase: SecretReferenceInterface | void
  clientKeyCertificate: SecretReferenceInterface | void
  clientKeyAlgo: string
  clientKeyCACertificate: SecretReferenceInterface | void
  skipDefaultValidation: boolean
}

const defaultInitialFormData: KubeFormInterface = {
  delegateType: DelegateTypes.DELEGATE_OUT_CLUSTER,
  authType: AuthTypes.USER_PASSWORD,
  username: undefined,
  password: undefined,
  serviceAccountToken: undefined,
  oidcIssuerUrl: '',
  oidcUsername: undefined,
  oidcPassword: undefined,
  oidcCleintId: undefined,
  oidcCleintSecret: undefined,
  oidcScopes: '',
  clientKey: undefined,
  clientKeyCertificate: undefined,
  clientKeyPassphrase: undefined,
  clientKeyAlgo: '',
  clientKeyCACertificate: undefined,
  skipDefaultValidation: false
}

interface AuthOptionInterface {
  label: string
  value: string
}

const RenderK8AuthForm: React.FC<FormikProps<KubeFormInterface> & { isEditMode: boolean }> = props => {
  const { getString } = useStrings()

  switch (props.values.authType) {
    case AuthTypes.USER_PASSWORD:
      return (
        <Container width={'42%'}>
          <TextReference
            name="username"
            label={getString('username')}
            type={props.values.username ? props.values.username?.type : ValueType.TEXT}
          />
          <SecretInput name={'password'} label={getString('password')} />
        </Container>
      )
    case AuthTypes.SERVICE_ACCOUNT:
      return (
        <Container width={'42%'}>
          <SecretInput name={'serviceAccountToken'} label={getString('connectors.k8.serviceAccountToken')} />
        </Container>
      )
    case AuthTypes.OIDC:
      return (
        <>
          <FormInput.Text
            name="oidcIssuerUrl"
            label={getString('connectors.k8.OIDCIssuerUrl')}
            className={css.formFieldWidth}
          />
          <Container className={css.applyFlex}>
            <Container width={'42%'}>
              <TextReference
                name="oidcUsername"
                label={getString('connectors.k8.OIDCUsername')}
                type={props.values.oidcUsername ? props.values.oidcUsername.type : ValueType.TEXT}
              />

              <SecretInput name={'oidcPassword'} label={getString('connectors.k8.OIDCPassword')} />
            </Container>

            <Container width={'42%'} margin={{ top: 'medium', left: 'xxlarge' }}>
              <SecretInput name={'oidcCleintId'} label={getString('connectors.k8.OIDCClientId')} />
              <SecretInput name={'oidcCleintSecret'} label={getString('connectors.k8.OIDCSecret')} />
            </Container>
          </Container>

          <FormInput.Text
            name="oidcScopes"
            label={getString('connectors.k8.OIDCScopes')}
            className={css.formFieldWidth}
          />
        </>
      )
    case AuthTypes.CLIENT_KEY_CERT:
      return (
        <>
          <Container className={css.formRow}>
            <SecretInput name={'clientKey'} label={getString('connectors.k8.clientKey')} />
            <SecretInput name={'clientKeyPassphrase'} label={getString('connectors.k8.clientKeyPassphrase')} />
          </Container>
          <Container className={css.formRow}>
            <SecretInput name={'clientKeyCertificate'} label={getString('connectors.k8.clientCertificate')} />
            <FormInput.Text name="clientKeyAlgo" label={getString('connectors.k8.clientKeyAlgorithm')} />
          </Container>
          <Container width={'42%'}>
            <SecretInput name={'clientKeyCACertificate'} label={getString('connectors.k8.clientKeyCACertificate')} />
          </Container>
        </>
      )
    default:
      return null
  }
}

const Stepk8ClusterDetails: React.FC<StepProps<Stepk8ClusterDetailsProps> & K8ClusterDetailsProps> = props => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const { getString } = useStrings()

  const DelegateCards: DelegateCardInterface[] = [
    {
      type: DelegateTypes.DELEGATE_OUT_CLUSTER,
      info: getString('connectors.k8.delegateOutClusterInfo')
    },
    // TODO: Enable after Delegate dependency is resolved
    {
      type: DelegateTypes.DELEGATE_IN_CLUSTER,
      info: getString('connectors.k8.delegateInClusterInfo'),
      disabled: true
    }
  ]

  const authOptions: Array<AuthOptionInterface> = [
    {
      label: getString('usernamePassword'),
      value: AuthTypes.USER_PASSWORD
    },
    {
      label: getString('serviceAccount'),
      value: AuthTypes.SERVICE_ACCOUNT
    },
    {
      label: getString('connectors.k8.authLabels.OIDC'),
      value: AuthTypes.OIDC
    },
    {
      label: getString('connectors.k8.authLabels.clientKeyCertificate'),
      value: AuthTypes.CLIENT_KEY_CERT
    }
  ]

  const validationSchema = Yup.object().shape({
    masterUrl: Yup.string().trim().required(getString('validation.masterUrl')),
    authType: Yup.string().trim().required(getString('validation.authType')),
    username: Yup.string()
      .nullable()
      .when('authType', {
        is: authType => authType === AuthTypes.USER_PASSWORD,
        then: Yup.string().required(getString('validation.username'))
      }),
    password: Yup.object().when('authType', {
      is: authType => authType === AuthTypes.USER_PASSWORD,
      then: Yup.object().required(getString('validation.password')),
      otherwise: Yup.object().nullable()
    }),
    serviceAccountToken: Yup.object().when('authType', {
      is: authType => authType === AuthTypes.SERVICE_ACCOUNT,
      then: Yup.object().required(getString('validation.serviceAccountToken')),
      otherwise: Yup.object().nullable()
    }),
    oidcIssuerUrl: Yup.string().when('authType', {
      is: authType => authType === AuthTypes.OIDC,
      then: Yup.string().required(getString('validation.OIDCIssuerUrl')),
      otherwise: Yup.string().nullable()
    }),
    oidcUsername: Yup.string()
      .nullable()
      .when('authType', {
        is: authType => authType === AuthTypes.OIDC,
        then: Yup.string().required(getString('validation.OIDCUsername'))
      }),
    oidcPassword: Yup.object().when('authType', {
      is: authType => authType === AuthTypes.OIDC,
      then: Yup.object().required(getString('validation.OIDCPassword')),
      otherwise: Yup.object().nullable()
    }),
    oidcCleintId: Yup.object().when('authType', {
      is: authType => authType === AuthTypes.OIDC,
      then: Yup.object().required(getString('validation.OIDCClientId')),
      otherwise: Yup.object().nullable()
    }),
    oidcCleintSecret: Yup.object().when('authType', {
      is: authType => authType === AuthTypes.OIDC,
      then: Yup.object().required(getString('validation.OIDCSecret')),
      otherwise: Yup.object().nullable()
    }),
    clientKey: Yup.object().when('authType', {
      is: authType => authType === AuthTypes.CLIENT_KEY_CERT,
      then: Yup.object().required(getString('validation.clientKey')),
      otherwise: Yup.object().nullable()
    }),
    clientKeyPassphrase: Yup.object().when('authType', {
      is: authType => authType === AuthTypes.CLIENT_KEY_CERT,
      then: Yup.object().required(getString('validation.clientKeyPassphrase')),
      otherwise: Yup.object().nullable()
    }),
    clientKeyCertificate: Yup.object().when('authType', {
      is: authType => authType === AuthTypes.CLIENT_KEY_CERT,
      then: Yup.object().required(getString('validation.clientCertificate')),
      otherwise: Yup.object().nullable()
    })
  })

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      const response = await createConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${props.prevStepData?.name}' created successfully`)
      if (stepData.skipDefaultValidation) {
        props.onConnectorCreated(response.data)
      } else {
        props.nextStep?.({ ...props.prevStepData, ...stepData } as Stepk8ClusterDetailsProps)
        props.setIsEditMode(true)
      }
    } catch (e) {
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      const response = await updateConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${props.prevStepData?.name}' updated successfully`)
      if (stepData.skipDefaultValidation) {
        props.onConnectorCreated(response.data)
      } else {
        props.nextStep?.({ ...props.prevStepData, ...stepData } as Stepk8ClusterDetailsProps)
      }
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  useEffect(() => {
    if (loadingConnectorSecrets) {
      if (props.isEditMode) {
        if (props.connectorInfo) {
          setupKubFormData(props.connectorInfo, accountId).then(data => {
            setInitialValues(data as KubeFormInterface)
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
        {getString('connectors.k8.stepTwoName')}
      </Text>
      <Formik
        initialValues={{
          ...initialValues,
          ...props.prevStepData
        }}
        validationSchema={validationSchema}
        onSubmit={(formData: KubeFormInterface) => {
          const connectorData = {
            ...props.prevStepData,
            ...formData,
            projectIdentifier: projectIdentifier,
            orgIdentifier: orgIdentifier
          }

          const data = {
            ...buildKubPayload(connectorData)
          }

          if (props.isEditMode) {
            handleUpdate(data, formData)
          } else {
            handleCreate(data, formData)
          }
        }}
      >
        {formikProps => (
          <Form>
            <Container className={css.clusterWrapper}>
              <ModalErrorHandler bind={setModalErrorHandler} style={{ marginBottom: 'var(--spacing-medium)' }} />
              <CardSelect
                onChange={(item: DelegateCardInterface) => {
                  DelegateTypes.DELEGATE_OUT_CLUSTER !== formikProps.values.delegateType &&
                    formikProps?.setFieldValue('delegateType', item.type)
                }}
                data={DelegateCards}
                className={css.cardRow}
                renderItem={(item: DelegateCardInterface) => {
                  return (
                    <Container
                      className={cx(css.card, { [css.selectedCard]: item.type === formikProps.values.delegateType })}
                    >
                      <Text inline className={css.textInfo}>
                        {item.info}
                      </Text>
                      {item.type === formikProps.values.delegateType ? (
                        <Icon margin="small" name="deployment-success-new" size={16} />
                      ) : null}
                    </Container>
                  )
                }}
                selected={DelegateCards[DelegateCards.findIndex(card => card.type === formikProps.values.delegateType)]}
              />

              {DelegateTypes.DELEGATE_OUT_CLUSTER === formikProps.values.delegateType ? (
                <>
                  <FormInput.Text
                    label={getString('connectors.k8.masterUrlLabel')}
                    placeholder={getString('connectors.k8.placeholder.masterUrl')}
                    name="masterUrl"
                    className={css.formFieldWidth}
                  />

                  <Container className={css.authHeaderRow}>
                    <Text className={css.authTitle} inline>
                      {getString('connectors.authTitle')}
                    </Text>
                    <FormInput.Select
                      name="authType"
                      items={authOptions}
                      disabled={false}
                      className={css.authTypeSelect}
                    />
                  </Container>

                  <RenderK8AuthForm {...formikProps} isEditMode={props.isEditMode} />
                  <FormInput.CheckBox
                    name="skipDefaultValidation"
                    label={getString('connectors.k8.skipDefaultValidation')}
                    padding={{ left: 'xxlarge' }}
                  />
                </>
              ) : null}
            </Container>

            <Button
              type="submit"
              intent="primary"
              text={getString('saveAndContinue')}
              rightIcon="chevron-right"
              disabled={DelegateTypes.DELEGATE_OUT_CLUSTER !== formikProps.values.delegateType || loadConnector}
            />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default Stepk8ClusterDetails
