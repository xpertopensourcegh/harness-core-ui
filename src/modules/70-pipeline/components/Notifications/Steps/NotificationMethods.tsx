import { Color, Formik, FormInput, Layout, StepProps, Text } from '@wings-software/uicore'
import React from 'react'
import * as Yup from 'yup'
import { Form } from 'formik'
import { noop } from 'lodash-es'
import { useStrings } from 'framework/exports'
import { NotificationType } from '@notifications/interfaces/Notifications'
import type { NotificationRules, PmsEmailChannel, PmsPagerDutyChannel, PmsSlackChannel } from 'services/pipeline-ng'
import { NotificationTypeSelectOptions } from '@notifications/constants'
import ConfigureEmailNotifications from '@notifications/modals/ConfigureNotificationsModal/views/ConfigureEmailNotifications/ConfigureEmailNotifications'
import ConfigureSlackNotifications from '@notifications/modals/ConfigureNotificationsModal/views/ConfigureSlackNotifications/ConfigureSlackNotifications'
import ConfigurePagerDutyNotifications from '@notifications/modals/ConfigureNotificationsModal/views/ConfigurePagerDutyNotifications/ConfigurePagerDutyNotifications'

const NotificationMethods: React.FC<StepProps<NotificationRules>> = ({ prevStepData, nextStep, previousStep }) => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical spacing="xxlarge" padding="small">
      <Text font="medium" color={Color.BLACK}>
        {getString('pipeline-notifications.notificationMethod')}
      </Text>
      <Formik
        initialValues={{
          type: prevStepData?.notificationMethod?.type || '',
          emailIds: [],
          userGroups: [],
          recipients: [],
          webhookUrls: '',
          integrationKeys: '',
          ...prevStepData?.notificationMethod?.spec
        }}
        validationSchema={Yup.object().shape({
          type: Yup.string().required()
        })}
        onSubmit={values => {
          nextStep?.({
            notificationMethod: {
              type: values.type,
              spec: {
                userGroups: values.userGroups ? Object.keys(values.userGroups) : [],
                recipients: values.type === NotificationType.Email ? values.recipients : undefined,
                integrationKeys: values.type === NotificationType.PagerDuty ? values.recipients : undefined,
                webhookUrls: values.type === NotificationType.Slack ? values.recipients : undefined
              }
            },
            ...prevStepData
          })
        }}
      >
        {formikProps => {
          return (
            <Form>
              <Layout.Vertical height={500} width={500} spacing="large">
                <FormInput.Select
                  name="type"
                  label={getString('pipeline-notifications.notificationMethod')}
                  items={NotificationTypeSelectOptions}
                />
                {formikProps.values.type === NotificationType.Email ? (
                  <>
                    <ConfigureEmailNotifications
                      withoutHeading={true}
                      onSuccess={data => {
                        nextStep?.({
                          notificationMethod: {
                            type: formikProps.values.type,
                            spec: {
                              userGroups: Object.keys(data.userGroups),
                              recipients: data.emailIds
                            }
                          },
                          ...prevStepData
                        })
                      }}
                      hideModal={noop}
                      isStep={true}
                      onBack={() => previousStep?.({ ...prevStepData })}
                      config={{
                        type: NotificationType.Email,
                        emailIds: (prevStepData?.notificationMethod?.spec as PmsEmailChannel)?.recipients || [],
                        userGroups: prevStepData?.notificationMethod?.spec?.userGroups || []
                      }}
                    />
                  </>
                ) : null}

                {formikProps.values.type === NotificationType.Slack ? (
                  <ConfigureSlackNotifications
                    withoutHeading={true}
                    onSuccess={data => {
                      nextStep?.({
                        notificationMethod: {
                          type: formikProps.values.type,
                          spec: {
                            userGroups: Object.keys(data.userGroups),
                            webhookUrl: data.webhookUrl
                          }
                        },
                        ...prevStepData
                      })
                    }}
                    hideModal={noop}
                    isStep={true}
                    onBack={() => previousStep?.({ ...prevStepData })}
                    config={{
                      type: NotificationType.Slack,
                      webhookUrl:
                        (prevStepData?.notificationMethod?.spec as PmsSlackChannel)?.webhookUrls?.toString() || '',
                      userGroups: prevStepData?.notificationMethod?.spec?.userGroups || []
                    }}
                  />
                ) : null}
                {formikProps.values.type === NotificationType.PagerDuty ? (
                  <ConfigurePagerDutyNotifications
                    withoutHeading={true}
                    onSuccess={data => {
                      nextStep?.({
                        notificationMethod: {
                          type: formikProps.values.type,
                          spec: {
                            userGroups: Object.keys(data.userGroups),
                            integrationKey: data.key
                          }
                        },
                        ...prevStepData
                      })
                    }}
                    hideModal={() => undefined}
                    isStep={true}
                    onBack={() => previousStep?.({ ...prevStepData })}
                    config={{
                      type: NotificationType.PagerDuty,
                      key:
                        (prevStepData?.notificationMethod?.spec as PmsPagerDutyChannel).integrationKeys?.toString() ||
                        '',
                      userGroups: prevStepData?.notificationMethod?.spec?.userGroups || []
                    }}
                  />
                ) : null}
              </Layout.Vertical>
            </Form>
          )
        }}
      </Formik>
    </Layout.Vertical>
  )
}
export default NotificationMethods
