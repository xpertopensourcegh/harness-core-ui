import React from 'react'
import { Container, Heading, Formik, FormikForm, Color } from '@wings-software/uikit'
import i18n from '../VerificationJobForms.i18n'
import { FormControlButtons, useFormSubmit, basicValidation } from '../VerificationJobFormCommons'
import {
  JobName,
  VerificationSensitivity,
  ServiceName,
  Duration,
  EnvironmentName,
  DataSource,
  TrafficSplit
} from '../VerificationJobFields'
import css from './BlueGreenVerificationJobForm.module.scss'

export default function BlueGreenVerificationJobForm(): JSX.Element {
  const { onSubmit } = useFormSubmit()
  return (
    <Container className={css.main}>
      <Heading level={2} color={Color.BLACK} className={css.formHeading}>
        {i18n.bg.title}
      </Heading>
      <Formik initialValues={{}} validate={basicValidation} onSubmit={onSubmit}>
        <FormikForm className={css.formContent}>
          <JobName />
          <VerificationSensitivity />
          <ServiceName />
          <Duration />
          <EnvironmentName />
          <TrafficSplit />
          <DataSource />
          <FormControlButtons />
        </FormikForm>
      </Formik>
    </Container>
  )
}
