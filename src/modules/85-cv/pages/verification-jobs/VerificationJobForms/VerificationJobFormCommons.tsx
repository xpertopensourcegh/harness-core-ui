import React from 'react'
import { Button, Container, SelectOption, MultiSelectOption } from '@wings-software/uicore'
import { connect } from 'formik'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useToaster } from '@common/exports'
import { useSaveVerificationJob, VerificationJobDTO } from 'services/cv'
import routes from '@common/RouteDefinitions'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { ONBOARDING_ENTITIES } from '@cv/pages/admin/setup/SetupUtils'
import { useStrings } from 'framework/exports'
import type { VerificationSensitivity } from '../VerificationJobsSetup'

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

export function sensitivityEnunToLabel(sensitivity: VerificationSensitivity): string {
  switch (sensitivity) {
    case 'HIGH':
      return 'High'
    case 'MEDIUM':
      return 'Medium'
    case 'LOW':
    default:
      return 'Low'
  }
}

export function baselineEnumToLabel(baselineValue: string | number): string {
  switch (baselineValue) {
    case 'LAST':
      return 'Last Successful run'
    // case DefaultBaselineOptions[1].value:
    //   return DefaultBaselineOptions[1].label
    default:
      return new Date(baselineValue || 0).toLocaleString()
  }
}

export interface UseFormSubmitProps {
  onSuccess?(): void
}
// Remove this after old onbparding cleanup
export const useFormSubmit = (props?: UseFormSubmitProps) => {
  const { accountId, activityType, orgIdentifier, projectIdentifier } = useParams<
    ProjectPathProps & { activityType: string }
  >()
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
            orgIdentifier,
            projectIdentifier,
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
      projectIdentifier,
      orgIdentifier,
      dataSources: values.dataSource && values.dataSource.map((ds: SelectOption) => ds.value),
      sensitivity: values.sensitivity?.value || values.sensitivity,
      duration: values.duration?.value || values.duration,
      type: mapType(activityType)
    }

    saveVerificationJob(payload as VerificationJobDTO)
  }
  return { onSubmit, error, loading }
}

export interface UseVerificationFormSubmitProps {
  onSuccess(data: any): void
}

export const useVerificationJobFormSubmit = (props?: UseVerificationFormSubmitProps) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const { getString } = useStrings()
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
      if (dataSource[i].value === getString('all')) return true
    }
    return false
  }
  const onSubmit = (values: any) => {
    const payload = {
      activitySourceIdentifier: values?.activitySource,
      identifier: values.identifier,
      jobName: values.name,
      serviceIdentifier: values.service?.value || values.service,
      envIdentifier: values.environment?.value || values.environment,
      projectIdentifier,
      orgIdentifier,
      monitoringSources: isAllOptionSelected(values.dataSource)
        ? getDataSources(values.dataSourceOptions)
        : getDataSources(values.dataSource),
      sensitivity: values.sensitivity?.value || values.sensitivity,
      duration: values.duration?.value || values.duration,
      type: values.type,
      trafficSplitPercentage: values.trafficSplit?.value,
      baselineVerificationJobInstanceId: values.baseline?.value
    }

    saveVerificationJob(payload as VerificationJobDTO, values)
  }
  return { onSubmit, error, loading }
}
