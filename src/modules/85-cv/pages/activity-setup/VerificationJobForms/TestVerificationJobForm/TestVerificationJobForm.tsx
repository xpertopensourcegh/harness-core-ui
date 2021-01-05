import React from 'react'
import { Container, Heading, Formik, FormikForm, Color } from '@wings-software/uicore'
import i18n from '../VerificationJobForms.i18n'
import { FormControlButtons, useFormSubmit, basicValidation } from '../VerificationJobFormCommons'
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
  const { onSubmit } = useFormSubmit()
  return (
    <Container className={css.main}>
      <Heading level={2} color={Color.BLACK} className={css.formHeading}>
        {i18n.test.title}
      </Heading>
      <Formik initialValues={{}} validate={basicValidation} onSubmit={onSubmit}>
        <FormikForm className={css.formContent}>
          <JobName />
          <VerificationSensitivity />
          <ServiceName />
          <Duration />
          <EnvironmentName />
          <Baseline />
          <DataSource />
          <FormControlButtons />
        </FormikForm>
      </Formik>
    </Container>
  )
}
