import React, { useState, useEffect } from 'react'
import {
  Layout,
  Button,
  Formik,
  Text,
  ModalErrorHandler,
  FormikForm as Form,
  StepProps,
  ModalErrorHandlerBinding,
  Container,
  CardSelect,
  Color,
  Icon
} from '@wings-software/uicore'
import cx from 'classnames'
import * as Yup from 'yup'
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
import { DelegateSelectors } from '@common/components'
import css from '../CreateGcpConnector.module.scss'

interface GcpAuthenticationProps {
  name: string
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  onConnectorCreated: (data?: ConnectorConfigDTO) => void | Promise<void>
  connectorInfo: ConnectorInfoDTO | void
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
}

interface StepConfigureProps {
  closeModal?: () => void
  onSuccess?: () => void
}

interface GCPFormInterface {
  delegateType: string
  password: SecretReferenceInterface | void
  delegateSelectors?: Array<string>
}
const GcpAuthentication: React.FC<StepProps<StepConfigureProps> & GcpAuthenticationProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = props
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const [delegateSelectors, setDelegateSelectors] = useState<Array<string>>([])
  const { getString } = useStrings()

  const defaultInitialFormData: GCPFormInterface = {
    delegateType: DelegateTypes.DELEGATE_OUT_CLUSTER,
    password: undefined,
    delegateSelectors: []
  }

  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  const DelegateCards: DelegateCardInterface[] = [
    {
      type: DelegateTypes.DELEGATE_OUT_CLUSTER,
      info: getString('connectors.GCP.delegateOutClusterInfo')
    },
    {
      type: DelegateTypes.DELEGATE_IN_CLUSTER,
      info: getString('connectors.GCP.delegateInClusterInfo')
    }
  ]

  useEffect(() => {
    if (loadingConnectorSecrets) {
      if (props.isEditMode) {
        if (props.connectorInfo) {
          setupGCPFormData(props.connectorInfo, accountId).then(data => {
            setInitialValues(data as GCPFormInterface)
            setDelegateSelectors(data.delegateSelectors)
            setLoadingConnectorSecrets(false)
          })
        } else {
          setLoadingConnectorSecrets(false)
        }
      }
    }
  }, [loadingConnectorSecrets])

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      const response = await createConnector(data)
      showSuccess(getString('connectors.successfullCreate', { name: data.connector?.name }))
      setLoadConnector(false)
      nextStep?.({ ...prevStepData, ...stepData })
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
      nextStep?.({ ...prevStepData, ...stepData })
      props.onConnectorCreated(response.data)
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
        {getString('details')}
      </Text>
      <Formik
        initialValues={{
          ...initialValues,
          ...props.prevStepData
        }}
        validationSchema={Yup.object().shape({
          password: Yup.object().when('delegateType', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.object().required(getString('validation.encryptedKey'))
          })
        })}
        onSubmit={formData => {
          const connectorData = {
            ...prevStepData,
            ...formData,
            delegateSelectors,
            projectIdentifier: projectIdentifier,
            orgIdentifier: orgIdentifier
          }
          const data = buildGcpPayload(connectorData)

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
                <SecretInput name={'password'} label={getString('encryptedKeyLabel')} type={'SecretFile'} />
              ) : (
                <>
                  <Text font="medium" color={Color.BLACK} margin={{ bottom: 'small' }}>
                    {getString('delegate.DelegateselectionLabel')}
                  </Text>
                  <Text margin={{ bottom: 'medium' }}>{getString('delegate.DelegateselectionConnectorText')}</Text>
                  <DelegateSelectors
                    className={css.delegateSelectors}
                    fill
                    allowNewTag={false}
                    selectedItems={delegateSelectors}
                    placeholder={getString('delegate.DelegateselectionPlaceholder')}
                    onChange={data => {
                      setDelegateSelectors(data as Array<string>)
                    }}
                  ></DelegateSelectors>
                </>
              )}
            </Container>
            <Layout.Horizontal padding={{ top: 'small' }} spacing="medium">
              <Button
                text={getString('back')}
                icon="chevron-left"
                onClick={() => props?.previousStep?.(props?.prevStepData)}
                data-name="gcpBackButton"
              />
              <Button
                type="submit"
                intent="primary"
                text={getString('saveAndContinue')}
                rightIcon="chevron-right"
                disabled={
                  (DelegateTypes.DELEGATE_IN_CLUSTER === formikProps.values.delegateType &&
                    delegateSelectors.length === 0) ||
                  loadConnector
                }
              />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default GcpAuthentication
