import {
  StepProps,
  Layout,
  Color,
  Text,
  CardSelect,
  Icon,
  Container,
  FormInput,
  Button,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import * as Yup from 'yup'
import { Formik, Form, FormikProps } from 'formik'
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
import css from '../CreateK8sConnector.module.scss'

interface Stepk8ClusterDetailsProps extends ConnectorInfoDTO {
  name: string
}

interface K8ClusterDetailsProps {
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  connectorInfo: ConnectorInfoDTO | void
}

interface KubeFormInterface {
  delegateType: string
  authType: string
  username: TextReferenceInterface | null
  password: SecretReferenceInterface | null
  serviceAccountToken: SecretReferenceInterface | null
  oidcUsername: TextReferenceInterface | null
  oidcPassword: SecretReferenceInterface | null
  oidcCleintId: SecretReferenceInterface | null
  oidcCleintSecret: SecretReferenceInterface | null
  oidcScopes: string
  clientKey: SecretReferenceInterface | null
  clientKeyPassphrase: SecretReferenceInterface | null
  clientKeyCertificate: SecretReferenceInterface | null
  clientKeyAlgo: string
  clientKeyCACertificate: SecretReferenceInterface | null
  skipDefaultValidation: boolean
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
            type={props.values.username?.type || ValueType.TEXT}
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
                type={props.values.oidcUsername?.type || ValueType.TEXT}
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
      info: getString('connectors.delegateOutClusterInfo2')
    },
    {
      type: DelegateTypes.DELEGATE_IN_CLUSTER,
      info: getString('connectors.delegateInClusterInfo')
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

  const defaultInitialFormData: KubeFormInterface = {
    delegateType: DelegateTypes.DELEGATE_OUT_CLUSTER,
    authType: AuthTypes.USER_PASSWORD,
    username: null,
    password: null,
    serviceAccountToken: null,
    oidcUsername: null,
    oidcPassword: null,
    oidcCleintId: null,
    oidcCleintSecret: null,
    oidcScopes: '',
    clientKey: null,
    clientKeyCertificate: null,
    clientKeyPassphrase: null,
    clientKeyAlgo: '',
    clientKeyCACertificate: null,
    skipDefaultValidation: false
  }

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

  const validate = (formData: KubeFormInterface): boolean => {
    switch (formData.authType) {
      case AuthTypes.USER_PASSWORD:
        return !!formData.password?.referenceString
      case AuthTypes.SERVICE_ACCOUNT:
        return !!formData.serviceAccountToken?.referenceString
      case AuthTypes.OIDC:
        return !!(
          formData.oidcPassword?.referenceString &&
          formData.oidcCleintId?.referenceString &&
          formData.oidcCleintSecret?.referenceString
        )
      case AuthTypes.CLIENT_KEY_CERT:
        return !!(
          formData.clientKey?.referenceString &&
          formData.clientKeyCertificate?.referenceString &&
          formData.clientKeyPassphrase?.referenceString
        )
      default:
        return false
    }
  }

  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  useEffect(() => {
    if (loadingConnectorSecrets) {
      if (props.isEditMode && props.connectorInfo) {
        setupKubFormData(props.connectorInfo, accountId).then(data => {
          setInitialValues(data as KubeFormInterface)
          setLoadingConnectorSecrets(false)
        })
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
        validationSchema={Yup.object().shape({
          masterUrl: Yup.string().trim().required(getString('connectors.k8.validation.masterUrl')),

          username: Yup.string()
            .nullable()
            .when('authType', {
              is: authType => authType === AuthTypes.USER_PASSWORD,
              then: Yup.string().required(getString('connectors.k8.validation.username'))
            }),
          oidcUsername: Yup.string()
            .nullable()
            .when('authType', {
              is: authType => authType === AuthTypes.OIDC,
              then: Yup.string().required(getString('connectors.k8.validation.oidcUsername'))
            })
        })}
        onSubmit={(formData: KubeFormInterface) => {
          if (validate(formData)) {
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
          }
        }}
      >
        {formikProps => (
          <Form>
            <Container className={css.clusterWrapper}>
              <ModalErrorHandler bind={setModalErrorHandler} style={{ marginBottom: 'var(--spacing-medium)' }} />
              <CardSelect
                onChange={(item: DelegateCardInterface) => {
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
                    <FormInput.Select name="authType" items={authOptions} disabled={false} />
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
              className={css.saveButton}
              disabled={DelegateTypes.DELEGATE_OUT_CLUSTER !== formikProps.values.delegateType || loadConnector}
            />
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default Stepk8ClusterDetails
