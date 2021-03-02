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
  Color
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { useStrings } from 'framework/exports'
import {
  buildAWSPayload,
  DelegateTypes,
  SecretReferenceInterface,
  setupAWSFormData
} from '@connectors/pages/connectors/utils/ConnectorUtils'
import { PageSpinner, DelegateSelectors } from '@common/components'
import { useToaster } from '@common/exports'
import {
  useCreateConnector,
  useUpdateConnector,
  ConnectorConfigDTO,
  ConnectorRequestBody,
  ConnectorInfoDTO,
  AwsCredential
} from 'services/cd-ng'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import TextReference, { TextReferenceInterface, ValueType } from '@secrets/components/TextReference/TextReference'

import css from './StepAWSAuthentication.module.scss'
interface StepAWSAuthenticationProps extends ConnectorInfoDTO {
  name: string
}

interface AWSAuthenticationProps {
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo: ConnectorInfoDTO | void
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
}

interface AWSFormInterface {
  delegateType: AwsCredential['type']
  accessKey: TextReferenceInterface | void
  secretKeyRef: SecretReferenceInterface | void
  crossAccountAccess: boolean
  crossAccountRoleArn: string
  externalId: string
  delegateSelectors: Array<string>
}

const defaultInitialFormData: AWSFormInterface = {
  delegateType: DelegateTypes.DELEGATE_OUT_CLUSTER,
  accessKey: undefined,
  secretKeyRef: undefined,
  crossAccountAccess: false,
  crossAccountRoleArn: '',
  externalId: '',
  delegateSelectors: []
}

const StepAWSAuthentication: React.FC<StepProps<StepAWSAuthenticationProps> & AWSAuthenticationProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const { getString } = useStrings()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const [initialValues, setInitialValues] = useState(defaultInitialFormData)
  const [delegateSelectors, setDelegateSelectors] = useState<Array<string>>([])
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      const response = await createConnector(data)
      setLoadConnector(false)
      props.onConnectorCreated(response.data)
      props.setIsEditMode(true)
      showSuccess(`Connector '${prevStepData?.name}' created successfully`)
      nextStep?.({ ...prevStepData, ...stepData } as StepAWSAuthenticationProps)
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
      props.onConnectorCreated(response.data)
      showSuccess(`Connector '${prevStepData?.name}' updated successfully`)
      nextStep?.({ ...prevStepData, ...stepData } as StepAWSAuthenticationProps)
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (loadingConnectorSecrets) {
      if (props.isEditMode) {
        if (props.connectorInfo) {
          setupAWSFormData(props.connectorInfo as any, accountId).then(data => {
            setInitialValues(data as AWSFormInterface)
            setDelegateSelectors(data.delegateSelectors)
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
    <Layout.Vertical height={'inherit'} padding={{ left: 'small' }}>
      <Text font="medium" margin={{ top: 'small' }} color={Color.BLACK}>
        {getString('credentials')}
      </Text>
      <Formik
        initialValues={{
          ...initialValues,
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          // Enable when delegateSelector adds form validation
          // delegateSelector: Yup.string().when('delegateType', {
          //   is: DelegateTypes.DELEGATE_IN_CLUSTER,
          //   then: Yup.string().trim().required(i18n.STEP.TWO.validation.delegateSelector)
          // }),

          accessKey: Yup.string()
            .nullable()
            .when('delegateType', {
              is: DelegateTypes.DELEGATE_OUT_CLUSTER,
              then: Yup.string().trim().required(getString('connectors.aws.validation.accessKey'))
            }),
          secretKeyRef: Yup.object().when('delegateType', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.object().required(getString('connectors.aws.validation.secretKeyRef'))
          }),

          crossAccountRoleArn: Yup.string().when('crossAccountAccess', {
            is: true,
            then: Yup.string().trim().required(getString('connectors.aws.validation.crossAccountRoleArn'))
          })
        })}
        onSubmit={stepData => {
          const connectorData = {
            ...prevStepData,
            ...stepData,
            delegateSelectors,
            projectIdentifier: projectIdentifier,
            orgIdentifier: orgIdentifier
          }
          const data = buildAWSPayload(connectorData)

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

            <Layout.Vertical padding={{ top: 'xxlarge', bottom: 'large' }} className={css.formDataAws}>
              <FormInput.RadioGroup
                name="delegateType"
                items={[
                  { label: getString('connectors.aws.awsAccessKey'), value: DelegateTypes.DELEGATE_OUT_CLUSTER },
                  {
                    label: getString('connectors.aws.assumeIAMRole'),
                    value: DelegateTypes.DELEGATE_IN_CLUSTER
                  }
                ]}
                className={css.radioGroup}
              />
              {formikProps.values.delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
                <Layout.Vertical width={'56%'}>
                  <Text color={Color.BLACK} padding={{ top: 'small', bottom: 'large' }}>
                    {getString('connectors.authTitle')}
                  </Text>
                  <TextReference
                    name="accessKey"
                    label={getString('connectors.aws.accessKey')}
                    type={formikProps.values.accessKey ? formikProps.values.accessKey?.type : ValueType.TEXT}
                  />
                  <SecretInput name="secretKeyRef" label={getString('connectors.aws.secretKey')} />
                </Layout.Vertical>
              ) : (
                <>
                  <Text font="medium" color={Color.BLACK} margin={{ bottom: 'small' }}>
                    {getString('delegate.DelegateselectionLabel')}
                  </Text>
                  <Text margin={{ bottom: 'medium' }}>{getString('delegate.DelegateselectionConnectorText')}</Text>
                  <DelegateSelectors
                    className={css.formInput}
                    fill
                    allowNewTag={false}
                    placeholder={getString('delegate.DelegateselectionPlaceholder')}
                    selectedItems={delegateSelectors}
                    onChange={data => {
                      setDelegateSelectors(data as Array<string>)
                    }}
                  ></DelegateSelectors>
                </>
              )}

              <Layout.Vertical spacing="small">
                <FormInput.CheckBox
                  name="crossAccountAccess"
                  label={getString('connectors.aws.enableCrossAcc')}
                  className={css.stl}
                />
                {formikProps.values?.crossAccountAccess ? (
                  <>
                    <FormInput.Text
                      className={css.formInput}
                      name="crossAccountRoleArn"
                      label={getString('connectors.aws.crossAccURN')}
                    />
                    <FormInput.Text
                      className={css.formInput}
                      name="externalId"
                      label={getString('connectors.aws.externalId')}
                    />
                  </>
                ) : null}
              </Layout.Vertical>
            </Layout.Vertical>
            <Layout.Horizontal padding={{ top: 'small' }} spacing="medium">
              <Button
                text={getString('back')}
                icon="chevron-left"
                onClick={() => props?.previousStep?.(props?.prevStepData)}
                data-name="awsBackButton"
              />
              <Button
                type="submit"
                intent={'primary'}
                text={getString('saveAndContinue')}
                disabled={
                  (DelegateTypes.DELEGATE_IN_CLUSTER === formikProps.values.delegateType &&
                    delegateSelectors.length === 0) ||
                  loadConnector
                }
                rightIcon="chevron-right"
              />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default StepAWSAuthentication
