import type { FormikProps } from 'formik'
import type { ServiceLevelIndicatorDTO, ServiceLevelObjectiveDTO } from 'services/cv'
import { CreateSLOEnum } from './CreateSLO.constants'
import type { SLOForm } from './CreateSLO.types'

export const createSLORequestPayload = (
  values: SLOForm,
  orgIdentifier: string,
  projectIdentifier: string
): ServiceLevelObjectiveDTO => {
  const {
    serviceLevelIndicators: { type = '', spec = {} }
  } = values

  return {
    ...values,
    orgIdentifier,
    projectIdentifier,
    serviceLevelIndicators: [{ type, spec }] as ServiceLevelIndicatorDTO[]
  }
}

export const isFormDataValid = (formikProps: FormikProps<SLOForm>, selectedTabId: CreateSLOEnum): boolean => {
  if (selectedTabId === CreateSLOEnum.NAME) {
    formikProps.setFieldTouched('name')
    formikProps.setFieldTouched('userJourneyRef')

    const { name, userJourneyRef } = formikProps.values

    if (!name || !userJourneyRef) {
      return false
    }
  }

  if (selectedTabId === CreateSLOEnum.SLI) {
    formikProps.setFieldTouched('monitoredServiceRef')
    formikProps.setFieldTouched('healthSourceRef')
    formikProps.setFieldTouched('serviceLevelIndicators.spec.spec.eventType')
    formikProps.setFieldTouched('serviceLevelIndicators.spec.spec.metric1')
    formikProps.setFieldTouched('serviceLevelIndicators.spec.spec.metric2')
    formikProps.setFieldTouched('serviceLevelIndicators.spec.objectiveValue')
    formikProps.setFieldTouched('serviceLevelIndicators.spec.comparator')

    const { monitoredServiceRef, healthSourceRef, serviceLevelIndicators } = formikProps.errors

    if (monitoredServiceRef || healthSourceRef || serviceLevelIndicators) {
      return false
    }
  }

  return true
}
