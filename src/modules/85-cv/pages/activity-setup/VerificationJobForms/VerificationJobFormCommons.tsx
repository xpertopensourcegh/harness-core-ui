import React from 'react'
import { Button, Container, SelectOption, MultiSelectOption } from '@wings-software/uikit'
import { connect } from 'formik'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useToaster } from '@common/exports'
import { useSaveVerificationJob, VerificationJobDTO } from 'services/cv'
import routes from '@common/RouteDefinitions'
import { ONBOARDING_ENTITIES } from '@cv/pages/admin/setup/SetupUtils'

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
// Remove this after old onbparding cleanup
export const useFormSubmit = (props?: UseFormSubmitProps) => {
  const { accountId, activityType, orgIdentifier, projectIdentifier } = useParams()
  const history = useHistory()
  const { showError } = useToaster()
  const { mutate, error, loading } = useSaveVerificationJob({ queryParams: { accountId } })

  const saveVerificationJob = async (payload: VerificationJobDTO) => {
    try {
      await mutate(payload as VerificationJobDTO)
      if (props?.onSuccess) {
        props.onSuccess()
      } else {
        history.push(
          routes.toCVActivityDashboard({
            orgIdentifier: orgIdentifier as string,
            projectIdentifier: projectIdentifier as string,
            accountId
          })
        )
      }
    } catch (e) {
      showError(e.message)
    }
  }

  const onSubmit = (values: any) => {
    const payload = {
      identifier: values.identifier,
      jobName: values.jobName,
      serviceIdentifier: values.service?.value || values.service,
      envIdentifier: values.environment?.value || values.environment,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      dataSources: values.dataSource && values.dataSource.map((ds: SelectOption) => ds.value),
      sensitivity: values.sensitivity?.value || values.sensitivity,
      duration: values.duration?.value || values.duration,
      type: mapType(activityType as string)
    }

    saveVerificationJob(payload as VerificationJobDTO)
  }
  return { onSubmit, error, loading }
}

export interface UseVerificationFormSubmitProps {
  onSuccess(data: any): void
}

export const useVerificationJobFormSubmit = (props?: UseVerificationFormSubmitProps) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const history = useHistory()
  const { showError } = useToaster()
  const { mutate, error, loading } = useSaveVerificationJob({ queryParams: { accountId } })
  const saveVerificationJob = async (payload: VerificationJobDTO, values: any) => {
    try {
      await mutate(payload as VerificationJobDTO)
      if (props?.onSuccess) {
        props.onSuccess({ ...values, type: payload.type, sourceType: ONBOARDING_ENTITIES.VERIFICATION_JOBS })
        history.push(`${routes.toCVAdminSetup({ accountId, projectIdentifier, orgIdentifier })}?step=3`)
      }
    } catch (e) {
      showError(error?.message || e.message)
    }
  }

  const getDataSources = (dataSource: SelectOption[]) => {
    return dataSource?.map((ds: SelectOption) => ds.value)
  }

  const isAllOptionSelected = (dataSource: MultiSelectOption[]): boolean => {
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].value === 'All') return true
    }
    return false
  }
  const onSubmit = (values: any) => {
    const payload = {
      identifier: values.identifier,
      jobName: values.name,
      serviceIdentifier: values.service?.value || values.service,
      envIdentifier: values.environment?.value || values.environment,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      dataSources: isAllOptionSelected(values.dataSource)
        ? getDataSources(values.dataSourceOptions)
        : getDataSources(values.dataSource),
      sensitivity: values.sensitivity?.value || values.sensitivity,
      duration: values.duration?.value || values.duration,
      type: values.type
    }

    saveVerificationJob(payload as VerificationJobDTO, values)
  }
  return { onSubmit, error, loading }
}
