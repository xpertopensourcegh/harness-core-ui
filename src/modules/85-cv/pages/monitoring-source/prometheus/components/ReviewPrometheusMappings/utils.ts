import type { MultiSelectOption } from '@wings-software/uicore'
import type { MetricDefinition, TimeSeriesMetricDefinition } from 'services/cv'

import type {
  PrometheusDSConfig,
  PrometheusSetupSource,
  MapPrometheusQueryToService,
  RiskProfileCatgory,
  PrometheusFilter
} from '../../constants'

export function transformLabelToPrometheusFilter(options?: MultiSelectOption[]): PrometheusFilter[] {
  const filters: PrometheusFilter[] = []
  if (!options?.length) {
    return filters
  }

  for (const option of options) {
    const value = option.label.split(':')
    filters.push({ labelName: value[0], labelValue: value[1] })
  }

  return filters
}

export function transformPrometheusSourceToDSConfig(setupSource: PrometheusSetupSource): PrometheusDSConfig {
  const dsConfig: PrometheusDSConfig = {
    connectorIdentifier: setupSource.connectorRef?.value,
    type: 'PROMETHEUS',
    accountId: setupSource.accountId,
    projectIdentifier: setupSource.projectIdentifier,
    orgIdentifier: setupSource.orgIdentifier,
    productName: setupSource.productName,
    identifier: setupSource.identifier,
    monitoringSourceName: setupSource.monitoringSourceName,
    metricDefinitions: []
  }

  for (const entry of setupSource.mappedServicesAndEnvs.entries()) {
    const {
      envIdentifier,
      envFilter,
      metricName,
      groupName,
      prometheusMetric,
      serviceFilter,
      serviceInstance,
      serviceIdentifier,
      isManualQuery,
      query,
      aggregator,
      additionalFilter,
      riskCategory,
      lowerBaselineDeviation,
      higherBaselineDeviation
    }: MapPrometheusQueryToService = entry[1]

    if (!envIdentifier || !serviceIdentifier || !groupName || !metricName || !riskCategory) {
      continue
    }

    if (!isManualQuery && (!prometheusMetric || !envFilter || !serviceFilter || !serviceInstance)) {
      continue
    }

    const [category, metricType] = riskCategory?.split('/') || []
    const thresholdTypes: TimeSeriesMetricDefinition['thresholdType'][] = []
    if (lowerBaselineDeviation) {
      thresholdTypes.push('ACT_WHEN_LOWER')
    }
    if (higherBaselineDeviation) {
      thresholdTypes.push('ACT_WHEN_HIGHER')
    }

    dsConfig.metricDefinitions.push({
      prometheusMetric,
      metricName,
      serviceFilter: transformLabelToPrometheusFilter(serviceFilter),
      isManualQuery,
      query,
      envFilter: transformLabelToPrometheusFilter(envFilter),
      additionalFilters: transformLabelToPrometheusFilter(additionalFilter),
      aggregation: aggregator,
      serviceInstanceFieldName: serviceInstance,
      groupName: groupName.value as string,
      envIdentifier: envIdentifier.value as string,
      serviceIdentifier: serviceIdentifier.value as string,
      riskProfile: {
        category: category as RiskProfileCatgory,
        metricType: metricType as MetricDefinition['type'],
        thresholdTypes
      }
    })
  }

  return dsConfig
}
