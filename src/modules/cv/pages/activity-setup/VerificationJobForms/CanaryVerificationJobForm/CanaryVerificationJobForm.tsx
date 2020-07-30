import React from 'react'
import { Container, Heading, Formik, FormikForm, Color } from '@wings-software/uikit'
import {
  JobName,
  VerificationSensitivity,
  ServiceName,
  Duration,
  EnvironmentName,
  DataSource,
  TrafficSplit
} from '../VerificationJobFields'
import i18n from '../VerificationJobForms.i18n'
import css from './CanaryVerificationJobForm.module.scss'

export default function CanaryVerificationJobForm(): JSX.Element {
  return (
    <Container className={css.main}>
      <Heading level={2} color={Color.BLACK} className={css.formHeading}>
        {i18n.canary.title}
      </Heading>
      <Formik initialValues={{}} onSubmit={() => undefined}>
        <FormikForm className={css.formContent}>
          <JobName />
          <VerificationSensitivity />
          <ServiceName />
          <Duration />
          <EnvironmentName />
          <TrafficSplit />
          <DataSource />
        </FormikForm>
      </Formik>
    </Container>
  )
}
