import React, { useState } from 'react'
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
} from '@wings-software/uikit'
import cx from 'classnames'
import * as Yup from 'yup'
import {
  buildAWSPayload,
  DelegateTypes,
  DelegateInClusterType
} from '@connectors/pages/connectors/utils/ConnectorUtils'
import { useToaster } from '@common/exports'
import {
  useCreateConnector,
  useUpdateConnector,
  ConnectorConfigDTO,
  ConnectorRequestBody,
  ConnectorInfoDTO
} from 'services/cd-ng'
import { useGetDelegateTags } from 'services/portal'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import i18n from '../CreateAWSConnector.i18n'

import css from './StepAWSAuthentication.module.scss'

interface StepAWSAuthenticationProps extends ConnectorInfoDTO {
  name: string
  isEditMode?: boolean
}

interface AWSAuthenticationProps {
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
}

const StepAWSAuthentication: React.FC<StepProps<StepAWSAuthenticationProps> & AWSAuthenticationProps> = props => {
  const { prevStepData, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const [inclusterDelegate, setInClusterDelegate] = useState(DelegateInClusterType.useExistingDelegate)

  const { data: delagteTags } = useGetDelegateTags({ queryParams: { accountId } })
  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      props.onConnectorCreated?.()
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
      await updateConnector(data)
      setLoadConnector(false)
      showSuccess(`Connector '${prevStepData?.name}' updated successfully`)
      nextStep?.({ ...prevStepData, ...stepData } as StepAWSAuthenticationProps)
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  const formatDelegateTagList = (listData: string[] | undefined) => {
    return listData?.map((item: string) => ({ label: item || '', value: item || '' }))
  }

  const listData = delagteTags?.resource
  const delegateTagListFiltered = formatDelegateTagList(listData) || [{ label: '', value: '' }]

  return (
    <Layout.Vertical height={'inherit'}>
      <Text font="medium" margin={{ top: 'small' }} color={Color.BLACK}>
        {i18n.STEP.TWO.Heading}
      </Text>
      <Formik
        initialValues={{
          credential: DelegateTypes.DELEGATE_IN_CLUSTER,
          secretKeyRef: undefined,
          crossAccountAccess: '',
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          delegateSelector: Yup.string().when('credential', {
            is: DelegateTypes.DELEGATE_IN_CLUSTER,
            then: Yup.string().trim().required(i18n.STEP.TWO.validation.delegateSelector)
          }),
          accessKey: Yup.string().when('credential', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.string().trim().required(i18n.STEP.TWO.validation.accessKey)
          }),
          secretKeyRef: Yup.string().when('credential', {
            is: DelegateTypes.DELEGATE_OUT_CLUSTER,
            then: Yup.string().trim().required(i18n.STEP.TWO.validation.secretKeyRef)
          }),

          crossAccountRoleArn: Yup.string().when('crossAccountAccess', {
            is: true,
            then: Yup.string().trim().required(i18n.STEP.TWO.validation.crossAccountRoleArn)
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

          if (prevStepData?.isEditMode) {
            handleUpdate(data, stepData)
          } else {
            handleCreate(data, stepData)
          }
        }}
      >
        {formikProps => (
          <Form>
            <ModalErrorHandler bind={setModalErrorHandler} />

            <Layout.Vertical padding={{ top: 'large', bottom: 'large' }} width={'64%'} style={{ minHeight: '440px' }}>
              <FormInput.RadioGroup
                name="credential"
                items={[
                  { label: i18n.STEP.TWO.delegate, value: DelegateTypes.DELEGATE_IN_CLUSTER },
                  { label: i18n.STEP.TWO.manual, value: DelegateTypes.DELEGATE_OUT_CLUSTER }
                ]}
                className={css.radioGroup}
              />
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
              ) : null}
              {formikProps.values.credential === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
                <Layout.Vertical>
                  <FormInput.Text name="accessKey" label={i18n.STEP.TWO.accessKey} />
                  <SecretInput name={'secretKeyRef'} label={i18n.STEP.TWO.secretKey} />
                </Layout.Vertical>
              ) : null}

              <Layout.Vertical spacing="small">
                <FormInput.CheckBox name="crossAccountAccess" label={i18n.STEP.TWO.assumeSTSRole} className={css.stl} />
                {formikProps.values?.crossAccountAccess ? (
                  <>
                    <FormInput.Text name="crossAccountRoleArn" label={i18n.STEP.TWO.roleARN} />
                    <FormInput.Text name="externalId" label={i18n.STEP.TWO.externalId} />
                  </>
                ) : null}
              </Layout.Vertical>
            </Layout.Vertical>
            <Layout.Horizontal padding={{ top: 'small' }} spacing="medium">
              <Button
                onClick={() => props.previousStep?.({ ...prevStepData } as StepAWSAuthenticationProps)}
                text={i18n.STEP.TWO.BACK}
              />
              <Button
                type="submit"
                text={i18n.STEP.TWO.SAVE_CREDENTIALS_AND_CONTINUE}
                font="small"
                disabled={loadConnector}
              />
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

export default StepAWSAuthentication
