import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { FormikForm, FormInput, Button, Layout, Container, Icon, Heading } from '@wings-software/uikit'
import { Popover, Spinner } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'

import type { EmailNotificationConfiguration } from '@notifications/interfaces/Notifications'
import { TestStatus } from '@notifications/interfaces/Notifications'
import { NotificationType } from '@notifications/interfaces/Notifications'
import { useTestNotificationSetting, EmailSettingDTO } from 'services/notifications'
import { useStrings } from 'framework/exports'
import i18n from '../../ConfigureNotifications.i18n'
import css from '../../ConfigureNotificationsModal.module.scss'

interface EmailTestConfigData {
  to: string
  subject: string
  body: string
}

interface ConfigureEmailNotificationsProps {
  onSuccess: (notificationConfiguration: EmailNotificationConfiguration) => void
  hideModal: () => void
  isStep?: boolean
  onBack?: () => void
  config?: EmailNotificationConfiguration
}

interface TestEmailConfigProps {
  handleTest: (formData: EmailTestConfigData) => void
}

const TestEmailConfig: React.FC<TestEmailConfigProps> = props => {
  const handleSubmit = (_formData: EmailTestConfigData): void => {
    props.handleTest(_formData)
    // call test api
  }

  return (
    <Container padding={'large'}>
      <Formik<EmailTestConfigData>
        onSubmit={handleSubmit}
        validationSchema={Yup.object().shape({
          to: Yup.string().trim().required(i18n.validationTo),
          subject: Yup.string().trim().required(i18n.validationSubject),
          body: Yup.string().trim().required(i18n.validationBody)
        })}
        initialValues={{
          to: '',
          subject: '',
          body: ''
        }}
      >
        {formik => {
          return (
            <FormikForm>
              <FormInput.Text name={'to'} label={i18n.labelTo} />
              <FormInput.Text name={'subject'} label={i18n.labelSubject} />
              <FormInput.Text name={'body'} label={i18n.labelBody} />
              <Button
                text={i18n.buttonSend}
                onClick={event => {
                  event.stopPropagation()
                  formik.submitForm()
                }}
              />
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

interface EmailNotificationData {
  emailIds: string
  userGroups: string[]
}

const ConfigureEmailNotifications: React.FC<ConfigureEmailNotificationsProps> = props => {
  const [isOpen, setIsOpen] = useState(false)
  const { accountId } = useParams()
  const { getString } = useStrings()
  const [testStatus, setTestStatus] = useState<TestStatus>(TestStatus.INIT)

  const { mutate: testNotificationSetting, loading } = useTestNotificationSetting({})

  const handleTest = async (testData: EmailTestConfigData): Promise<void> => {
    setIsOpen(false)
    setTestStatus(TestStatus.LOADING)
    try {
      const resp = await testNotificationSetting({
        accountId,
        type: 'EMAIL',
        recipient: testData.to,
        notificationId: 'asd',
        subject: testData.subject,
        body: testData.body
      } as EmailSettingDTO)
      if (resp.status === 'SUCCESS') {
        if (resp.data) setTestStatus(TestStatus.SUCCESS)
        else setTestStatus(TestStatus.FAILED)
      } else {
        setTestStatus(TestStatus.FAILED)
      }
    } catch (err) {
      setTestStatus(TestStatus.ERROR)
    }
  }

  const handleSubmit = (formData: EmailNotificationData): void => {
    props.onSuccess({
      type: NotificationType.Email,
      emailIds: formData.emailIds
        .split(',')
        .map(email => email.trim())
        .filter(email => email),
      userGroups: formData.userGroups
    })
    props.hideModal()
  }

  return (
    <div className={css.body}>
      <Layout.Vertical spacing="large">
        <Heading className={css.title}>{i18n.titleEmail}</Heading>
        <Formik
          onSubmit={handleSubmit}
          validationSchema={Yup.object().shape({
            emailIds: Yup.string().trim().required()
          })}
          initialValues={{
            emailIds: props.config?.emailIds.toString() || '',
            userGroups: props.config?.userGroups || []
          }}
          enableReinitialize={true}
        >
          {() => {
            return (
              <FormikForm>
                <FormInput.TextArea name={'emailIds'} label={i18n.labelEmailIds} />
                <FormInput.KVTagInput name={'userGroups'} label={i18n.labelEmailUserGroups} />
                <Layout.Horizontal style={{ alignItems: 'center' }}>
                  <Popover isOpen={isOpen} onInteraction={setIsOpen}>
                    <Button
                      minimal
                      text={loading ? <Spinner size={Spinner.SIZE_SMALL} /> : i18n.buttonTest}
                      disabled={loading}
                    />
                    <TestEmailConfig handleTest={handleTest} />
                  </Popover>
                  {testStatus === TestStatus.SUCCESS ? <Icon name="tick" className={css.green} /> : null}
                  {testStatus === TestStatus.FAILED ? <Icon name="cross" className={css.red} /> : null}
                </Layout.Horizontal>
                {props.isStep ? (
                  <Layout.Horizontal spacing="medium" margin={{ top: 'xlarge' }}>
                    <Button text={getString('back')} onClick={props.onBack} />
                    <Button text={getString('next')} intent="primary" type="submit" />
                  </Layout.Horizontal>
                ) : (
                  <Layout.Horizontal spacing={'medium'} margin={{ top: 'xlarge' }}>
                    <Button type={'submit'} intent={'primary'} text={i18n.buttonSubmit} />
                    <Button text={i18n.buttonCancel} onClick={props.hideModal} />
                  </Layout.Horizontal>
                )}
              </FormikForm>
            )
          }}
        </Formik>
      </Layout.Vertical>
    </div>
  )
}

export default ConfigureEmailNotifications
