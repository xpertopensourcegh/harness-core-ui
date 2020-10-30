import React from 'react'
import { Container, Heading, Formik, FormikForm, Color } from '@wings-software/uikit'
import i18n from '../VerificationJobForms.i18n'
import { JobName, ServiceName, Duration, EnvironmentName, DataSource } from '../VerificationJobFields'
import { FormControlButtons, useFormSubmit, basicValidation } from '../VerificationJobFormCommons'
import css from './HealthVerificationJobForm.module.scss'

export default function HealthVerificationJobForm(): JSX.Element {
  const { onSubmit } = useFormSubmit()
  return (
    <Container className={css.main}>
      <Heading level={2} color={Color.BLACK} className={css.formHeading}>
        {i18n.health.title}
      </Heading>
      <Formik initialValues={{}} validate={basicValidation} onSubmit={onSubmit}>
        <FormikForm className={css.formContent}>
          <JobName />
          <Duration />
          <ServiceName />
          <EnvironmentName />
          <DataSource />
          <FormControlButtons />
        </FormikForm>
      </Formik>
    </Container>
  )
}
