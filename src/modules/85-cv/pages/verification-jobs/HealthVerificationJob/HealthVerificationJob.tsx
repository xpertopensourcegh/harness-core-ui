import React from 'react'
import { Container, Formik, FormikForm, Layout, Text, Color } from '@wings-software/uicore'

import * as Yup from 'yup'

import { useStrings } from 'framework/exports'

import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'

import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { VerificationJobType } from '@cv/constants'
import {
  ServiceName,
  EnvironmentName,
  Duration
} from '@cv/pages/activity-setup/VerificationJobForms/VerificationJobFields'
import { useVerificationJobFormSubmit } from '@cv/pages/activity-setup/VerificationJobForms/VerificationJobFormCommons'

interface VerificationJobsDetailsProps {
  stepData: any
  onPrevious: () => void
  onNext: (data: any) => void
}
const HealthVerificationJob: React.FC<VerificationJobsDetailsProps> = props => {
  const { getString } = useStrings()

  const { onSubmit, loading } = useVerificationJobFormSubmit({ onSuccess: props.onNext })

  return (
    <Container style={{ position: 'relative', top: 80 }}>
      <Formik
        initialValues={{ ...props.stepData }}
        validationSchema={Yup.object().shape({
          service: Yup.string().trim().required(getString('cv.verificationJobs.validation.service')),

          environment: Yup.string().required(getString('cv.verificationJobs.validation.environment')),
          duration: Yup.string().required(getString('cv.verificationJobs.validation.duration'))
        })}
        onSubmit={data => {
          onSubmit({ ...props.stepData, ...data })
        }}
      >
        {formik => {
          return (
            <FormikForm>
              <Layout.Vertical width="50%" style={{ margin: 'auto' }}>
                <Text font={{ size: 'medium', weight: 'bold' }} color={Color.GREY_800} margin={{ bottom: 'small' }}>
                  {getString('cv.verificationJobs.configure.heading')}
                </Text>
                <CVSelectionCard
                  isSelected={true}
                  iconProps={{
                    name: 'health',
                    size: 20
                  }}
                  onCardSelect={() => {
                    formik.setFieldValue('type', VerificationJobType.TEST)
                  }}
                  cardLabel={getString('health')}
                />
                <Text margin={{ bottom: 'large' }} padding={{ top: 'xlarge' }}>
                  {getString('cv.verificationJobs.configure.postDepText')}
                </Text>
                <Layout.Horizontal>
                  <Container margin={{ right: 'xlarge' }} width={'300px'}>
                    <ServiceName />
                    <EnvironmentName />
                  </Container>
                  <Container width={'300px'}>
                    <Duration />
                  </Container>
                </Layout.Horizontal>

                <SubmitAndPreviousButtons onPreviousClick={props.onPrevious} nextButtonProps={{ loading }} />
              </Layout.Vertical>
            </FormikForm>
          )
        }}
      </Formik>
    </Container>
  )
}

export default HealthVerificationJob
