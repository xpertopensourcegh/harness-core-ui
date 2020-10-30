import React from 'react'
import { Button, Container, SelectOption } from '@wings-software/uikit'
import { connect } from 'formik'
import { useHistory } from 'react-router-dom'
import { useRouteParams } from 'framework/exports'
import { useToaster } from '@common/exports'
import { useSaveVerificationJob, VerificationJobDTO } from 'services/cv'
import { routeCVActivities } from 'navigation/cv/routes'

export const FormControlButtons = connect(({ formik }) => (
  <Container
    margin={{ bottom: 'medium' }}
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    }}
  >
    <Button disabled={!formik.dirty || !formik.isValid} type="submit" text="Save" width={120} />
  </Container>
))

export const basicValidation = (values: any) => {
  const errors: any = {}
  const requiredFields = ['jobName', 'service', 'environment', 'dataSource', 'duration']
  for (const key of requiredFields) {
    if (!values[key]) {
      errors[key] = 'Required'
    }
  }
  return errors
}

const mapType = (type: string) => {
  switch (type) {
    case 'bg-verification':
      return 'BLUE_GREEN'
    case 'test-verification':
      return 'TEST'
    case 'canary-verification':
      return 'CANARY'
    case 'health-verification':
      return 'HEALTH'
  }
}

export interface UseFormSubmitProps {
  onSuccess?(): void
}

export const useFormSubmit = (props?: UseFormSubmitProps) => {
  const {
    params: { accountId, activityType, orgIdentifier, projectIdentifier }
  } = useRouteParams()
  const history = useHistory()
  const { showError } = useToaster()
  const { mutate, error, loading } = useSaveVerificationJob({ queryParams: { accountId } })
  const onSubmit = (values: any) => {
    const payload = {
      identifier: values.identifier,
      jobName: values.jobName,
      serviceIdentifier: values.service && values.service.value,
      envIdentifier: values.environment && values.environment.value,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      dataSources: values.dataSource && values.dataSource.map((ds: SelectOption) => ds.value),
      sensitivity: values.sensitivity && values.sensitivity.value,
      duration: values.duration && values.duration.value,
      type: mapType(activityType as string)
    }
    mutate(payload as VerificationJobDTO)
      .catch(e => showError(e.message))
      .then(() => {
        if (props?.onSuccess) {
          props.onSuccess()
        } else {
          history.push(
            routeCVActivities.url({
              orgIdentifier: orgIdentifier as string,
              projectIdentifier: projectIdentifier as string
            })
          )
        }
      })
  }
  return { onSubmit, error, loading }
}
