import React, { useState, useEffect } from 'react'
import {
  StepWizard,
  Container,
  Formik,
  FormInput,
  FormikForm,
  Button,
  StepProps,
  Layout,
  Text,
  Color
} from '@wings-software/uicore'
import * as Yup from 'yup'
import { pick } from 'lodash-es'
import { useStrings } from 'framework/strings'

import ConditionsForm from '@cv/components/CVNotifications/NotificationConditions/ConditionsForm'

import { StringUtils } from '@common/exports'

import { NotificationTypeSelectOptions } from '@notifications/constants'
import { NotificationType } from '@notifications/interfaces/Notifications'
import ConfigureEmailNotifications from '@notifications/modals/ConfigureNotificationsModal/views/ConfigureEmailNotifications/ConfigureEmailNotifications'
import ConfigureSlackNotifications from '@notifications/modals/ConfigureNotificationsModal/views/ConfigureSlackNotifications/ConfigureSlackNotifications'
import ConfigurePagerDutyNotifications from '@notifications/modals/ConfigureNotificationsModal/views/ConfigurePagerDutyNotifications/ConfigurePagerDutyNotifications'
import type { AlertRuleDTO } from 'services/cv'
import type { CVNotificationForm } from '@cv/pages/admin/notifications/NotificationInterfaces'
import css from './CreateCVNotification.module.scss'

interface CreateCVNotificationProps {
  onSuccess: () => void
  hideModal: () => void
  projectIdentifier: string
  orgIdentifier: string
  isEditMode?: boolean
  notificationData?: AlertRuleDTO | void
}
interface NotificationDetailsProps {
  name?: string
  isEditMode: boolean
  setRuleData: (data: CVNotificationForm | undefined) => void
  ruleData: CVNotificationForm | undefined
}

const NotificationDetails: React.FC<StepProps<any> & NotificationDetailsProps> = props => {
  // Integrate unique identifier api with modal error handler

  const { getString } = useStrings()

  return (
    <Layout.Vertical spacing="large" width={'60%'}>
      <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.BLACK}>
        {getString('cv.admin.notifications.create.stepOne.heading')}
      </Text>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...props.ruleData }}
        onSubmit={formData => {
          props.nextStep?.({ ...props.prevStepData, ...formData })
          props.setRuleData({ ...(props.ruleData as CVNotificationForm), ...formData })
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(getString('validation.nameRequired')),
          identifier: Yup.string().when('name', {
            is: val => val?.length,
            then: Yup.string()
              .trim()
              .required(getString('validation.identifierRequired'))
              .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, getString('validation.validIdRegex'))
              .notOneOf(StringUtils.illegalIdentifiers)
          }),
          notificationSettingType: Yup.string().required(getString('cv.admin.notifications.create.validation.type'))
        })}
      >
        {() => (
          <FormikForm>
            <Container className={css.formBody}>
              <FormInput.InputWithIdentifier
                inputLabel={getString('cv.admin.notifications.create.stepOne.name')}
                isIdentifierEditable={!props.isEditMode}
              />
              <FormInput.Select
                items={NotificationTypeSelectOptions}
                name={'notificationSettingType'}
                label={getString('cv.admin.notifications.create.type')}
              />
            </Container>
            <Button text="Next" type="submit" intent="primary" />
          </FormikForm>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

interface NotificationMethodProps {
  name?: string
  type: string
  ruleData: CVNotificationForm | undefined
  isEditMode: boolean
  setRuleData: (data: CVNotificationForm | undefined) => void
}

const NotificationMethod: React.FC<StepProps<any> & NotificationMethodProps> = props => {
  const [type1, setType1] = useState(props.type)

  useEffect(() => {
    if (props.type) {
      setType1(props.type)
    }
  }, [props.type])
  switch (type1) {
    case NotificationType.Email:
      return (
        <ConfigureEmailNotifications
          onSuccess={data => {
            props.setRuleData({ ...(props.ruleData as CVNotificationForm), ...data })
            props.nextStep?.({ ...props.ruleData, ...data })
          }}
          hideModal={() => undefined}
          isStep={true}
          onBack={() => props.prevStepData?.()}
          config={{
            type: NotificationType.Email,
            emailIds: props.ruleData?.emailIds || [],
            userGroups: []
          }}
        />
      )
    case NotificationType.Slack:
      return (
        <ConfigureSlackNotifications
          onSuccess={data => {
            props.setRuleData({ ...(props.ruleData as CVNotificationForm), ...data })
            props.nextStep?.({ ...props.ruleData, ...data })
          }}
          hideModal={() => undefined}
          isStep={true}
          onBack={() => props.previousStep?.()}
          config={{
            type: NotificationType.Slack,
            webhookUrl: props.ruleData?.webhookUrl as string,
            userGroups: []
          }}
        />
      )
    case NotificationType.PagerDuty:
      return (
        <ConfigurePagerDutyNotifications
          onSuccess={data => {
            props.setRuleData({ ...(props.ruleData as CVNotificationForm), ...data })
            props.nextStep?.({ ...props.ruleData, ...data })
          }}
          hideModal={() => undefined}
          isStep={true}
          onBack={() => props.prevStepData?.()}
          config={{
            type: NotificationType.PagerDuty,
            key: props.ruleData?.key || '',
            userGroups: []
          }}
        />
      )
    default:
      return <></>
  }
}

const CreateCVNotification: React.FC<StepProps<any> & CreateCVNotificationProps> = props => {
  const [ruleData, setRuleData] = useState<CVNotificationForm>()
  const { getString } = useStrings()

  useEffect(() => {
    if (props.isEditMode && props.notificationData) {
      const formatData = {
        ...pick(props.notificationData, ['name', 'identifier', 'uuid']),
        notificationSettingType: props.notificationData.notificationMethod?.notificationSettingType,
        enabledRisk: props.notificationData.alertCondition?.enabledRisk,
        environments: props.notificationData.alertCondition?.environments,
        threshold: props.notificationData.alertCondition?.notify?.threshold,
        services: props.notificationData.alertCondition?.services,
        activityTypes: props.notificationData.alertCondition?.verificationsNotify?.activityTypes,
        verificationStatuses: props.notificationData.alertCondition?.verificationsNotify?.verificationStatuses,
        webhookUrl: props.notificationData.notificationMethod?.slackWebhook,
        enabledVerifications: props.notificationData.alertCondition?.enabledVerifications,
        key: props.notificationData.notificationMethod?.pagerDutyKey,
        emailIds: props.notificationData.notificationMethod?.emails,
        allServices: props.notificationData.alertCondition?.allServices,
        allEnvironments: props.notificationData.alertCondition?.allEnvironments,
        allActivityTpe: props.notificationData.alertCondition?.verificationsNotify?.allActivityTpe,
        allVerificationStatuses: props.notificationData.alertCondition?.verificationsNotify?.allVerificationStatuses
      }
      setRuleData(formatData as CVNotificationForm)
    }
  }, [props.notificationData])

  return (
    <div className={css.createNotification}>
      <StepWizard>
        <NotificationDetails
          name={getString('cv.admin.notifications.create.details')}
          isEditMode={!!props.isEditMode}
          ruleData={ruleData}
          setRuleData={setRuleData}
        />

        <NotificationMethod
          name={getString('cv.admin.notifications.create.method')}
          type={ruleData?.notificationSettingType || ''}
          isEditMode={!!props.isEditMode}
          ruleData={ruleData}
          setRuleData={setRuleData}
        />
        <ConditionsForm
          onSuccess={props.onSuccess}
          name={getString('conditions')}
          isEditMode={!!props.isEditMode}
          ruleData={ruleData}
          setRuleData={setRuleData}
          hideModal={props.hideModal}
          projectIdentifier={props.projectIdentifier}
          orgIdentifier={props.orgIdentifier}
        />
      </StepWizard>
    </div>
  )
}

export default CreateCVNotification
