import React from 'react'
import { Container, Heading, Formik, FormikForm, Color } from '@wings-software/uikit'
import i18n from '../VerificationJobForms.i18n'
import {
  JobName,
  VerificationSensitivity,
  ServiceName,
  Duration,
  EnvironmentName,
  DataSource,
  Baseline
} from '../VerificationJobFields'
import css from './TestVerificationJobForm.module.scss'

export default function TestVerificationJobForm(): JSX.Element {
  return (
    <Container className={css.main}>
      <Heading level={2} color={Color.BLACK} className={css.formHeading}>
        {i18n.test.title}
      </Heading>
      <Formik initialValues={{}} onSubmit={() => undefined}>
        <FormikForm className={css.formContent}>
          <JobName />
          <VerificationSensitivity />
          <ServiceName />
          <Duration />
          <EnvironmentName />
          <Baseline />
          <DataSource />
        </FormikForm>
      </Formik>
    </Container>
  )
}
