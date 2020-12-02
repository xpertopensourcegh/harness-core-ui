import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import {
  Layout,
  Button,
  Formik,
  FormInput,
  Text,
  ModalErrorHandler,
  FormikForm as Form,
  StepProps,
  ModalErrorHandlerBinding,
  Container,
  CardSelect,
  Color,
  Icon
} from '@wings-software/uikit'
import cx from 'classnames'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import {
  buildGcpPayload,
  DelegateTypes,
  DelegateCardInterface,
  SecretReferenceInterface,
  setupGCPFormData
} from '@connectors/pages/connectors/utils/ConnectorUtils'
import { useToaster } from '@common/exports'
import type { ConnectorConfigDTO, ConnectorRequestBody, ConnectorInfoDTO } from 'services/cd-ng'
import { useCreateConnector, useUpdateConnector } from 'services/cd-ng'

import SecretInput from '@secrets/components/SecretInput/SecretInput'
import { useStrings } from 'framework/exports'
import css from '../CreateGcpConnector.module.scss'

interface GcpAuthenticationProps {
  name: string
  isEditMode: boolean
  onConnectorCreated: (data?: ConnectorConfigDTO) => void | Promise<void>
  connectorInfo: ConnectorInfoDTO | void
}

interface StepConfigureProps {
  closeModal?: () => void
  onSuccess?: () => void
}

interface GCPFormInterface {
  delegateType: string
  password: SecretReferenceInterface | null
  skipDefaultValidation: boolean
}
const GcpAuthentication: React.FC<StepProps<StepConfigureProps> & GcpAuthenticationProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const { getString } = useStrings()

  const defaultInitialFormData: GCPFormInterface = {
    delegateType: DelegateTypes.DELEGATE_OUT_CLUSTER,
    password: null,
    skipDefaultValidation: true
  }

  const validate = (formData: GCPFormInterface): boolean => {
    return !!formData.password?.referenceString
  }

  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  const DelegateCards: DelegateCardInterface[] = [
    {
      type: DelegateTypes.DELEGATE_OUT_CLUSTER,
      info: getString('connectors.delegateOutClusterInfo1')
    },
    {
      type: DelegateTypes.DELEGATE_IN_CLUSTER,
      info: getString('connectors.delegateInClusterInfo')
    }
  ]

  useEffect(() => {
    if (loadingConnectorSecrets) {
      if (props.isEditMode && props.connectorInfo) {
        setupGCPFormData(props.connectorInfo, accountId).then(data => {
          setInitialValues(data as GCPFormInterface)
          setLoadingConnectorSecrets(false)
        })
      }
    }
  }, [loadingConnectorSecrets])

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      const response = await createConnector(data)
      setLoadConnector(false)
      props.onConnectorCreated?.()
      showSuccess(`Connector '${data.connector?.name}' created successfully`)
      if (stepData.skipDefaultValidation) {
        props.onConnectorCreated(response.data)
      } else {
        nextStep?.({ ...prevStepData, ...stepData })
      }
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
      setLoadConnector(false)
      showSuccess(`Connector '${data.connector?.name}' updated successfully`)
      if (stepData.skipDefaultValidation) {
        props.onConnectorCreated(response.data)
      } else {
        nextStep?.({ ...prevStepData, ...stepData })
      }
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

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
        onSubmit={formData => {
          if (validate(formData)) {
            const connectorData = {
              ...prevStepData,
              ...formData,
              projectIdentifier: projectIdentifier,
              orgIdentifier: orgIdentifier
            }
            const data = buildGcpPayload(connectorData)

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
                  <SecretInput name={'password'} label={getString('encryptedKeyLabel')} type={'SecretFile'} />

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

export default GcpAuthentication
