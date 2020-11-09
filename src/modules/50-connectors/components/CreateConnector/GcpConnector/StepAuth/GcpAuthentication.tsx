import React, { useState } from 'react'
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
  SelectOption,
  ModalErrorHandlerBinding
} from '@wings-software/uikit'
import * as Yup from 'yup'
import { GCP_AUTH_TYPE, buildGcpPayload } from '@connectors/pages/connectors/utils/ConnectorUtils'
import { useToaster } from '@common/exports'
import type { ConnectorConfigDTO, ConnectorRequestBody } from 'services/cd-ng'
import { useCreateConnector, useUpdateConnector } from 'services/cd-ng'
import { useGetDelegateTags } from 'services/portal'
import SecretInput from '@secrets/components/SecretInput/SecretInput'
import i18n from '../CreateGcpConnector.i18n'
import css from '../CreateGcpConnector.module.scss'

interface StepGcpAuthenticationProps {
  name: string
  isEditMode: boolean
  onConnectorCreated?: (data?: ConnectorConfigDTO) => void | Promise<void>
  secretName?: string
}

interface StepConfigureProps {
  closeModal?: () => void
  onSuccess?: () => void
}

const GcpAuthentication: React.FC<StepGcpAuthenticationProps & StepProps<StepConfigureProps>> = props => {
  const { prevStepData, isEditMode = false, nextStep } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { showSuccess } = useToaster()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const { mutate: updateConnector } = useUpdateConnector({ queryParams: { accountIdentifier: accountId } })
  const [loadConnector, setLoadConnector] = useState(false)
  const { data: delegateTagsResponse } = useGetDelegateTags({ queryParams: { accountId } })
  const [authType, setAuthType] = useState(GCP_AUTH_TYPE.DELEGATE)
  const [useExisting] = useState(true)

  const handleCreate = async (data: ConnectorRequestBody, stepData: ConnectorConfigDTO): Promise<void> => {
    try {
      modalErrorHandler?.hide()
      setLoadConnector(true)
      await createConnector(data)
      setLoadConnector(false)
      props.onConnectorCreated?.()
      showSuccess(`Connector '${data.connector?.name}' created successfully`)
      nextStep?.({ ...prevStepData, ...stepData })
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
      showSuccess(`Connector '${data.connector?.name}' updated successfully`)
      nextStep?.({ ...prevStepData, ...stepData })
    } catch (error) {
      setLoadConnector(false)
      modalErrorHandler?.showDanger(error.data?.message || error.message)
    }
  }

  const formatDelegateList = (listData: Array<string>): SelectOption[] => {
    return listData?.map(item => {
      return { label: item || '', value: item || '' }
    })
  }

  const selectExistingDelegate = (disabled: boolean) => {
    const delegateListFiltered = delegateTagsResponse?.resource?.length
      ? formatDelegateList(delegateTagsResponse?.resource)
      : [{ label: '', value: '' }]
    return (
      <>
        <FormInput.Select
          name="delegateSelector"
          disabled={disabled}
          className={css.selectDelegate}
          items={delegateListFiltered}
        />
      </>
    )
  }

  const RenderDelegateInclusterForm: React.FC = () => {
    return (
      <div className={css.incluster}>
        <Text className={css.howToProceed}>{i18n.STEP_TWO.HOW_TO_PROCEED}</Text>
        <div className={css.radioOption}>
          <input type="radio" defaultChecked={useExisting} />
          <span className={css.label}>Use an existing Delegate</span>
        </div>
        {selectExistingDelegate(!useExisting)}
        <div className={css.radioOption}>
          <input type="radio" defaultChecked={!useExisting} disabled />
          <span className={css.label}>Add a new Delegate</span>
        </div>
      </div>
    )
  }

  return (
    <Layout.Vertical height={'inherit'}>
      <Text font="medium" margin={{ top: 'small', left: 'small' }} color="var(--grey-800)">
        {i18n.STEP_TWO.Heading}
      </Text>
      <Formik
        initialValues={{
          authType: GCP_AUTH_TYPE.DELEGATE,
          password: undefined,
          ...prevStepData
        }}
        validationSchema={Yup.object().shape({
          delegateSelector: Yup.string().when('authType', {
            is: GCP_AUTH_TYPE.DELEGATE,
            then: Yup.string().trim().required(i18n.STEP_TWO.VALIDATION.delegateSelector)
          }),
          password: Yup.string().when('credential', {
            is: GCP_AUTH_TYPE.ENCRYPTED_KEY,
            then: Yup.string().trim().required(i18n.STEP_TWO.VALIDATION.password)
          })
        })}
        onSubmit={stepData => {
          const connectorData = {
            ...prevStepData,
            ...stepData,
            projectIdentifier: projectIdentifier,
            orgIdentifier: orgIdentifier
          }
          const data = buildGcpPayload(connectorData)

          if (isEditMode) {
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
                style={{ fontSize: 'normal' }}
                inline
                name="authType"
                items={[
                  { label: i18n.STEP_TWO.AUTH_TYPE.DELEGATE_LABEL, value: GCP_AUTH_TYPE.DELEGATE },
                  { label: i18n.STEP_TWO.AUTH_TYPE.ENCRYPTED_KEY_LABEL, value: GCP_AUTH_TYPE.ENCRYPTED_KEY }
                ]}
                radioGroup={{ inline: true }}
                onChange={event => {
                  setAuthType((event.target as HTMLInputElement).value)
                }}
              />
              {formikProps.values.authType === GCP_AUTH_TYPE.DELEGATE ? <RenderDelegateInclusterForm /> : null}
              {formikProps.values.authType === GCP_AUTH_TYPE.ENCRYPTED_KEY ? (
                <SecretInput name={'password'} label={i18n.STEP_TWO.ENCRYPTED_KEY} />
              ) : null}
            </Layout.Vertical>

            <Layout.Horizontal padding={{ top: 'small' }} spacing="medium">
              <Button onClick={() => props.previousStep?.({ ...prevStepData })} text={i18n.STEP_TWO.BACK} />
              <Button
                type="submit"
                text={
                  authType === GCP_AUTH_TYPE.DELEGATE && !useExisting
                    ? i18n.STEP_TWO.CONTINUE
                    : i18n.STEP_TWO.SAVE_CREDENTIALS_AND_CONTINUE
                }
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

export default GcpAuthentication
