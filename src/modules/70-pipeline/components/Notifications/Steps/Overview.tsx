import { Button, Color, Container, Formik, FormInput, Layout, StepProps, Text } from '@wings-software/uicore'
import React from 'react'
import { Form } from 'formik'
import * as Yup from 'yup'
import { useStrings } from 'framework/exports'
import type { NotificationRules } from 'services/pipeline-ng'

interface OverviewProps {
  data?: NotificationRules
}

const Overview: React.FC<StepProps<NotificationRules> & OverviewProps> = ({ data, nextStep, prevStepData }) => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical spacing="xxlarge" padding="small">
      <Text font="medium" color={Color.BLACK}>
        {getString('pipeline-notifications.nameOftheRule')}
      </Text>
      <Formik
        initialValues={{ name: '', ...data, ...prevStepData }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required()
        })}
        onSubmit={values => {
          nextStep?.(values)
        }}
      >
        {() => {
          return (
            <Form>
              <Container height={400} width={400}>
                <FormInput.Text name="name" label={getString('pipeline-notifications.notificationName')} />
              </Container>
              <Button type="submit" intent="primary" rightIcon="chevron-right" text={getString('saveAndContinue')} />
            </Form>
          )
        }}
      </Formik>
    </Layout.Vertical>
  )
}

export default Overview
