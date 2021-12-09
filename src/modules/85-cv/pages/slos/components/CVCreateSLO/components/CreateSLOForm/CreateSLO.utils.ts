import type { FormikProps } from 'formik'
import { CreateSLOEnum } from './CreateSLO.constants'
import type { SLOForm } from './CreateSLO.types'

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
