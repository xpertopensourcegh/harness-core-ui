import type { FormikProps } from 'formik'
import type { ServiceLevelObjectiveDTO, SLIMetricSpec } from 'services/cv'
import { SLIMetricEnum } from './components/SLI/SLI.constants'
import { CreateSLOEnum } from './CreateSLO.constants'
import type { SLOForm } from './CreateSLO.types'

export const createSLORequestPayload = (
  values: SLOForm,
  orgIdentifier: string,
  projectIdentifier: string
): ServiceLevelObjectiveDTO => {
  const serviceLevelIndicatorSpec = values.serviceLevelIndicators.spec
  const serviceLevelIndicatorMetricSpec = values.serviceLevelIndicators.spec.spec as any // Forced type should be removed after BE changes
  const isRatioBasedMetric = serviceLevelIndicatorSpec.type === SLIMetricEnum.RATIO

  return {
    ...values,
    orgIdentifier,
    projectIdentifier,
    serviceLevelIndicators: [
      {
        type: values.serviceLevelIndicators.type,
        spec: {
          ...serviceLevelIndicatorSpec,
          spec: {
            ...serviceLevelIndicatorMetricSpec,
            eventType: isRatioBasedMetric ? serviceLevelIndicatorMetricSpec.eventType : undefined,
            metric1: isRatioBasedMetric ? serviceLevelIndicatorMetricSpec.metric1 : undefined,
            metricName: serviceLevelIndicatorMetricSpec.metric1
          } as SLIMetricSpec // Forced type should be removed after BE changes
        }
      }
    ]
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
