import type { SelectOption } from '@wings-software/uicore'
import { isNumber } from 'lodash-es'
import type { FormikProps } from 'formik'
import type { UseStringsReturn } from 'framework/strings'
import type { MapPrometheusQueryToService } from '../../constants'
import { MapPrometheusQueryToServiceFieldNames } from './constants'

type UpdateSelectedMetricsMap = {
  updatedMetric: string
  oldMetric: string
  mappedMetrics: Map<string, MapPrometheusQueryToService>
  formikProps: FormikProps<MapPrometheusQueryToService | undefined>
}

export function updateSelectedMetricsMap({
  updatedMetric,
  oldMetric,
  mappedMetrics,
  formikProps
}: UpdateSelectedMetricsMap) {
  const updatedMap = new Map(mappedMetrics)

  // in the case where user updates metric name, update the key for current value
  if (oldMetric !== formikProps.values?.metricName) {
    updatedMap.delete(oldMetric)
  }

  // if newly created metric create form object
  if (!updatedMap.has(updatedMetric)) {
    updatedMap.set(updatedMetric, { metricName: updatedMetric, query: '', isManualQuery: false })
  }

  // update map with current form data
  if (formikProps.values?.metricName) {
    updatedMap.set(formikProps.values.metricName, formikProps.values as MapPrometheusQueryToService)
  }
  return { selectedMetric: updatedMetric, mappedMetrics: updatedMap }
}

export function validateMappings(
  getString: UseStringsReturn['getString'],
  createdMetrics: string[],
  selectedMetricIndex: number,
  values?: MapPrometheusQueryToService
): { [fieldName: string]: string } {
  const requiredFieldErrors = {
    [MapPrometheusQueryToServiceFieldNames.ENVIRONMENT]: getString('cv.monitoringSources.envValidation'),
    [MapPrometheusQueryToServiceFieldNames.ENVIRONMENT_FILTER]: getString(
      'cv.monitoringSources.prometheus.validation.filterOnEnvironment'
    ),
    [MapPrometheusQueryToServiceFieldNames.METRIC_NAME]: getString('cv.monitoringSources.metricNameValidation'),
    [MapPrometheusQueryToServiceFieldNames.PROMETHEUS_METRIC]: getString(
      'cv.monitoringSources.prometheus.validation.promethusMetric'
    ),
    [MapPrometheusQueryToServiceFieldNames.RISK_CATEGORY]: getString(
      'cv.monitoringSources.gco.mapMetricsToServicesPage.validation.riskCategory'
    ),
    [MapPrometheusQueryToServiceFieldNames.SERVICE]: getString('cv.monitoringSources.serviceValidation'),
    [MapPrometheusQueryToServiceFieldNames.SERVICE_FILTER]: getString(
      'cv.monitoringSources.prometheus.validation.filterOnService'
    ),
    [MapPrometheusQueryToServiceFieldNames.SERVICE_INSTANCE]: getString(
      'cv.monitoringSources.prometheus.validation.serviceInstanceIdentifier'
    ),
    [MapPrometheusQueryToServiceFieldNames.QUERY]: getString(
      'cv.monitoringSources.gco.manualInputQueryModal.validation.query'
    )
  }

  if (!values) {
    return requiredFieldErrors
  }

  if (values.isManualQuery) {
    delete requiredFieldErrors[MapPrometheusQueryToServiceFieldNames.SERVICE_FILTER]
    delete requiredFieldErrors[MapPrometheusQueryToServiceFieldNames.ENVIRONMENT_FILTER]
    delete requiredFieldErrors[MapPrometheusQueryToServiceFieldNames.SERVICE_INSTANCE]
    delete requiredFieldErrors[MapPrometheusQueryToServiceFieldNames.PROMETHEUS_METRIC]
  }

  for (const fieldName of Object.keys(requiredFieldErrors)) {
    switch (fieldName) {
      case MapPrometheusQueryToServiceFieldNames.ENVIRONMENT_FILTER:
        if (values.envFilter?.length) delete requiredFieldErrors[fieldName]
        break
      case MapPrometheusQueryToServiceFieldNames.SERVICE_FILTER:
        if (values.serviceFilter?.length) delete requiredFieldErrors[fieldName]
        break
      default:
        if ((values as any)[fieldName]) delete requiredFieldErrors[fieldName]
    }
  }

  if (values.lowerBaselineDeviation !== true && values.higherBaselineDeviation !== true) {
    requiredFieldErrors[MapPrometheusQueryToServiceFieldNames.LOWER_BASELINE_DEVIATION] = getString(
      'cv.monitoringSources.prometheus.validation.deviation'
    )
  }

  const duplicateNames = createdMetrics?.filter((metricName, index) => {
    if (index === selectedMetricIndex) {
      return false
    }
    return metricName === values.metricName
  })

  if (values.metricName && duplicateNames.length) {
    requiredFieldErrors[MapPrometheusQueryToServiceFieldNames.METRIC_NAME] = getString(
      'cv.monitoringSources.prometheus.validation.metricNameUnique'
    )
  }

  if (
    !requiredFieldErrors[MapPrometheusQueryToServiceFieldNames.QUERY] &&
    isNumber(values.recordCount) &&
    values.recordCount > 1
  ) {
    requiredFieldErrors[MapPrometheusQueryToServiceFieldNames.QUERY] = getString(
      'cv.monitoringSources.prometheus.validation.recordCount'
    )
  }

  return requiredFieldErrors
}

export function initializePrometheusGroupNames(
  mappedMetrics: Map<string, MapPrometheusQueryToService>,
  getString: UseStringsReturn['getString']
): SelectOption[] {
  const groupNames = Array.from(mappedMetrics?.entries())
    .map(metric => {
      const { groupName } = metric?.[1] || {}
      return groupName || null
    })
    .filter(groupItem => groupItem !== null) as SelectOption[]
  return [{ label: getString('cv.addNew'), value: '' }, ...groupNames]
}
