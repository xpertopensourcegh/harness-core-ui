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
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import React, { useState } from 'react'
import cx from 'classnames'
import * as Yup from 'yup'
import { Formik, Form, FormikProps } from 'formik'
import { ConnectorInfoDTO, ConnectorRequestBody, useCreateConnector, useUpdateConnector } from 'services/cd-ng'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import { buildKubPayload, DelegateTypes, AuthTypes } from '@connectors/pages/connectors/utils/ConnectorUtils'
import { useToaster } from '@common/components/Toaster/useToaster'
import { useStrings } from 'framework/exports'
import css from '../CreateK8sConnector.module.scss'

interface Stepk8ClusterDetailsProps extends ConnectorInfoDTO {
  name: string
}

interface K8ClusterDetailsProps {
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode?: boolean
}

interface DelegateCardInterface {
  type: string
  info: string
}

interface SecretReferenceInterface {
  identifier: string
  name: string
  referenceString: string
}

interface KubeFormInterface {
  delegateType?: string
  authType?: string
  username?: string
  password?: SecretReferenceInterface | null
  serviceAccountToken?: SecretReferenceInterface | null
  oidcUsername?: string
  oidcPassword?: SecretReferenceInterface | null
  oidcCleintId?: SecretReferenceInterface | null
  oidcCleintSecret?: SecretReferenceInterface | null
  oidcScopes?: string
  clientKey?: SecretReferenceInterface | null
  clientKeyPassphrase?: SecretReferenceInterface | null
  clientKeyCertificate?: SecretReferenceInterface | null
  clientKeyAlgorithm?: string
  clientKeyCACertificate?: string
}

interface AuthOptionInterface {
  label: string
  value: string
}

const RenderK8AuthForm: React.FC<FormikProps<KubeFormInterface>> = props => {
  const { getString } = useStrings('connectors')
  switch (props.values.authType) {
    case AuthTypes.USER_PASSWORD:
      return (
        <>
          <FormInput.Text name="username" label={getString('k8.username')} />
          <SecretInput name={'password'} label={getString('k8.password')} />
        </>
      )
    case AuthTypes.SERVICE_ACCOUNT:
      return (
        <>
          <SecretInput name={'serviceAccountToken'} label={getString('k8.serviceAccountToken')} />
          <FormInput.CheckBox
            name="skipNamespace"
            label={getString('k8.skipDefaultValidation')}
            padding={{ left: 'xxlarge' }}
          />
        </>
      )
    case AuthTypes.OIDC:
      return (
        <>
          <Container className={css.formRow}>
            <FormInput.Text name="oidcUsername" label={getString('k8.OIDCUsername')} />
            <SecretInput name={'oidcPassword'} label={getString('k8.OIDCPassword')} />
          </Container>
          <Container className={css.formRow}>
            <SecretInput name={'oidcCleintId'} label={getString('k8.OIDCClientId')} />
            <SecretInput name={'oidcCleintSecret'} label={getString('k8.OIDCSecret')} />
          </Container>
          <FormInput.Text name="oidcScopes" label={getString('k8.OIDCScopes')} />
          <FormInput.CheckBox
            name="skipNamespace"
            label={getString('k8.skipDefaultValidation')}
            padding={{ left: 'xxlarge' }}
          />
        </>
      )
    case AuthTypes.CLIENT_KEY_CERT:
      return (
        <>
          <Container className={css.formRow}>
            <SecretInput name={'clientKey'} label={getString('k8.clientKey')} />
            <SecretInput name={'clientKeyPassphrase'} label={getString('k8.clientKeyPassphrase')} />
          </Container>
          <Container className={css.formRow}>
            <SecretInput name={'clientKeyCertificate'} label={getString('k8.clientCertificate')} />
            <FormInput.Text name="clientKeyAlgorithm" label={getString('k8.clientKeyAlgorithm')} />
          </Container>
          <FormInput.Text name="clientKeyCACertificate" label={getString('k8.clientKeyCACertificate')} />
          <FormInput.CheckBox
            name="skipNamespace"
            label={getString('k8.skipDefaultValidation')}
            padding={{ left: 'xxlarge' }}
          />
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
  const { getString } = useStrings('connectors')

  const DelegateCards: DelegateCardInterface[] = [
    {
      type: DelegateTypes.DELEGATE_OUT_CLUSTER,
      info: getString('delegateOutClusterInfo')
    },
    {
      type: DelegateTypes.DELEGATE_IN_CLUSTER,
      info: getString('delegateInClusterInfo')
    }
  ]

  const authOptions: Array<AuthOptionInterface> = [
    {
      label: getString('k8.authLabels.usernamePassword'),
      value: AuthTypes.USER_PASSWORD
    },
    {
      label: getString('k8.authLabels.serviceAccount'),
      value: AuthTypes.SERVICE_ACCOUNT
    },
    {
      label: getString('k8.authLabels.OIDC'),
      value: AuthTypes.OIDC
    },
    {
      label: getString('k8.authLabels.clientKeyCertificate'),
      value: AuthTypes.CLIENT_KEY_CERT
    }
  ]

  const handleCreate = async (data: ConnectorRequestBody): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${props.prevStepData?.name}' created successfully`)
      props.nextStep?.()
    } catch (e) {
      modalErrorHandler?.showDanger(e.data?.message || e.message)
    }
  }

  const handleUpdate = async (data: ConnectorRequestBody): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await updateConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${props.prevStepData?.name}' updated successfully`)
      props.nextStep?.()
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

  return (
    <Layout.Vertical height={'inherit'} spacing="medium" className={css.secondStep}>
      <Text font="medium" margin={{ top: 'small' }} color={Color.BLACK}>
        {getString('k8.stepTwoName')}
      </Text>
      <Formik
        initialValues={{
          delegateType: DelegateTypes.DELEGATE_OUT_CLUSTER,
          authType: AuthTypes.USER_PASSWORD,
          username: '',
          password: null,
          serviceAccountToken: null,
          oidcUsername: '',
          oidcPassword: null,
          oidcCleintId: null,
          oidcCleintSecret: null,
          oidcScopes: '',
          clientKey: null,
          clientKeyCertificate: null,
          clientKeyPassphrase: null
        }}
        validationSchema={Yup.object().shape({
          masterUrl: Yup.string().trim().required(getString('k8.validation.masterUrl')),
          username: Yup.string().when('authType', {
            is: val => val === AuthTypes.USER_PASSWORD,
            then: Yup.string().required(getString('k8.validation.username'))
          }),
          oidcUsername: Yup.string().when('authType', {
            is: val => val === AuthTypes.OIDC,
            then: Yup.string().required(getString('k8.validation.oidcUsername'))
          })
        })}
        onSubmit={formData => {
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
              handleUpdate(data)
            } else {
              handleCreate(data)
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
                    label={getString('k8.masterUrlLabel')}
                    placeholder={getString('k8.placeholder.masterUrl')}
                    name="masterUrl"
                  />

                  <Container className={css.authHeaderRow}>
                    <Text className={css.authTitle} inline>
                      {getString('k8.authTitle')}
                    </Text>
                    <FormInput.Select name="authType" items={authOptions} disabled={false} />
                  </Container>

                  <RenderK8AuthForm {...formikProps} />
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
