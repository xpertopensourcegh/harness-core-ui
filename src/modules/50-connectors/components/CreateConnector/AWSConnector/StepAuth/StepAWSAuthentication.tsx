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
import { PageSpinner } from '@common/components'
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
  credential: AwsCredential['type']
  accessKey: string
  secretKeyRef: SecretReferenceInterface | void
  crossAccountAccess: boolean
  crossAccountRoleArn: string
  externalId: string
}

const defaultInitialFormData: AWSFormInterface = {
  credential: DelegateTypes.DELEGATE_OUT_CLUSTER,
  accessKey: '',
  secretKeyRef: undefined,
  crossAccountAccess: false,
  crossAccountRoleArn: '',
  externalId: ''
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
  //Todo: const [inclusterDelegate, setInClusterDelegate] = useState(DelegateInClusterType.useExistingDelegate)
  const [loadingConnectorSecrets, setLoadingConnectorSecrets] = useState(true && props.isEditMode)

  // const { data: delagteTags } = useGetDelegateTags({ queryParams: { accountId } })
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

  // Todo:  const formatDelegateTagList = (listData: string[] | undefined) => {
  //     return listData?.map((item: string) => ({ label: item || '', value: item || '' }))
  //   }

  //   const listData = delagteTags?.resource
  //  const delegateTagListFiltered = formatDelegateTagList(listData) || [{ label: '', value: '' }]

  useEffect(() => {
    if (loadingConnectorSecrets) {
      if (props.isEditMode) {
        if (props.connectorInfo) {
          setupAWSFormData(props.connectorInfo as any, accountId).then(data => {
            setInitialValues(data as AWSFormInterface)
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
        {getString('connectors.aws.stepTwoName')}
      </Text>
      <Formik
        initialValues={{
          ...initialValues,
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          // Enable when delegate support is available
          // delegateSelector: Yup.string().when('credential', {
          //   is: DelegateTypes.DELEGATE_IN_CLUSTER,
          //   then: Yup.string().trim().required(i18n.STEP.TWO.validation.delegateSelector)
          // }),
          accessKey: Yup.string().when('credential', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.string().trim().required(getString('connectors.aws.validation.accessKey'))
          }),
          secretKeyRef: Yup.object().when('credential', {
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
                name="credential"
                items={[
                  { label: getString('connectors.aws.awsAccessKey'), value: DelegateTypes.DELEGATE_OUT_CLUSTER },
                  {
                    label: getString('connectors.aws.assumeIAMRole'),
                    value: DelegateTypes.DELEGATE_IN_CLUSTER,
                    disabled: true
                  }
                ]}
                className={css.radioGroup}
              />
              {/* Enable when delegate support is available
               {formikProps.values?.credential === DelegateTypes.DELEGATE_IN_CLUSTER ? (
                <div className={css.incluster}>
                  <div
                    className={css.radioOption}
                    onClick={() => {
                      setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
                    }}
                  >
                    <input type="radio" checked={inclusterDelegate === DelegateInClusterType.useExistingDelegate} />
                    <Text margin={{ left: 'large' }}>{i18n.STEP.TWO.useExistingDelegateSelector}</Text>
                  </div>
                  {inclusterDelegate === DelegateInClusterType.useExistingDelegate ? (
                    <FormInput.Select
                      name="delegateSelector"
                      label={i18n.STEP.TWO.delegateSelector}
                      items={delegateTagListFiltered}
                    />
                  ) : null}
                  <div
                    className={cx(css.radioOption, css.cursorDisabled)}
                    onClick={() => {
                      setInClusterDelegate(DelegateInClusterType.addNewDelegate)
                    }}
                  >
                    <input type="radio" checked={inclusterDelegate === DelegateInClusterType.addNewDelegate} disabled />
                    <Text margin={{ left: 'large' }}>{i18n.STEP.TWO.addNewDelegate}</Text>
                  </div>
                </div>
              ) : null} */}
              {formikProps.values.credential === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
                <Layout.Vertical width={'52%'}>
                  <Text color={Color.BLACK} padding={{ top: 'small', bottom: 'large' }}>
                    {getString('connectors.authTitle')}
                  </Text>
                  <FormInput.Text name="accessKey" label={getString('connectors.aws.accessKey')} />
                  <SecretInput name="secretKeyRef" label={getString('connectors.aws.secretKey')} />
                </Layout.Vertical>
              ) : null}

              <Layout.Vertical spacing="small">
                <FormInput.CheckBox
                  name="crossAccountAccess"
                  label={getString('connectors.aws.enableCrossAcc')}
                  className={css.stl}
                />
                {formikProps.values?.crossAccountAccess ? (
                  <>
                    <FormInput.Text name="crossAccountRoleArn" label={getString('connectors.aws.crossAccURN')} />
                    <FormInput.Text name="externalId" label={getString('connectors.aws.externalId')} />
                  </>
                ) : null}
              </Layout.Vertical>
            </Layout.Vertical>
            <Layout.Horizontal padding={{ top: 'small' }} spacing="medium">
              <Button
                onClick={() => props.previousStep?.({ ...prevStepData } as StepAWSAuthenticationProps)}
                text={getString('back')}
              />
              <Button
                type="submit"
                intent={'primary'}
                text={getString('saveAndContinue')}
                disabled={loadConnector}
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
