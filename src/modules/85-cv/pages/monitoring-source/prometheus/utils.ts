import { omit } from 'lodash-es'
import type { MultiSelectOption } from '@wings-software/uicore'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import type { DSConfig } from 'services/cv'
import {
  PrometheusDSConfig,
  PrometheusTabIndex,
  PrometheusFilter,
  PrometheusProductNames,
  PrometheusSetupSource
} from './constants'

export function determineMaxTab(source: PrometheusSetupSource): number {
  if (!source) {
    return PrometheusTabIndex.SELECT_CONNECTOR
  }
  if (source.mappedServicesAndEnvs.size) {
    return PrometheusTabIndex.REVIEW_MAPPINGS
  }
  if (source.connectorRef && source.identifier) {
    return PrometheusTabIndex.MAP_QUERIES
  }
  return PrometheusTabIndex.SELECT_CONNECTOR
}

export function buildDefaultPrometheusMonitoringSource({
  orgIdentifier,
  projectIdentifier,
  accountId
}: ProjectPathProps): PrometheusSetupSource {
  return {
    monitoringSourceName: 'Prometheus',
    accountId,
    orgIdentifier,
    projectIdentifier,
    isEdit: false,
    productName: PrometheusProductNames.APM,
    identifier: 'Prometheus',
    type: 'PROMETHEUS' as DSConfig['type'],
    mappedServicesAndEnvs: new Map([
      ['Prometheus Metric', { metricName: 'Prometheus Metric', query: '', isManualQuery: false }]
    ])
  }
}

function generateMultiSelectOptionListFromPrometheusFilter(filters: PrometheusFilter[]): MultiSelectOption[] {
  if (!filters?.length) {
    return []
  }

  const options: MultiSelectOption[] = []
  for (const filter of filters) {
    if (filter?.labelName && filter.labelValue) {
      options.push({ label: `${filter.labelName}:${filter.labelValue}`, value: filter.labelValue })
    }
  }

  return options
}

export function transformPrometheusDSConfigIntoPrometheusSetupSource(
  params: ProjectPathProps,
  dsConfig?: DSConfig | null
): PrometheusSetupSource {
  if (!dsConfig) {
    return buildDefaultPrometheusMonitoringSource(params)
  }

  const setupSource = {
    ...buildDefaultPrometheusMonitoringSource(params),
    mappedServicesAndEnvs: new Map(),
    ...omit(dsConfig, ['metricDefinitions']),
    isEdit: true
  }
  for (const metricDefinition of (dsConfig as PrometheusDSConfig)?.metricDefinitions || []) {
    setupSource.mappedServicesAndEnvs.set(metricDefinition.metricName, {
      metricName: metricDefinition.metricName,
      serviceIdentifier: { label: metricDefinition.serviceIdentifier, value: metricDefinition.serviceIdentifier },
      envIdentifier: { label: metricDefinition.envIdentifier, value: metricDefinition.envIdentifier },
      prometheusMetric: metricDefinition.prometheusMetric,
      query: metricDefinition.query,
      isManualQuery: metricDefinition.isManualQuery,
      serviceFilter: generateMultiSelectOptionListFromPrometheusFilter(metricDefinition.serviceFilter),
      envFilter: generateMultiSelectOptionListFromPrometheusFilter(metricDefinition.envFilter),
      additionalFilter: generateMultiSelectOptionListFromPrometheusFilter(metricDefinition.additionalFilters || []),
      aggregator: metricDefinition.aggregation,
      riskCategory: `${metricDefinition.riskProfile?.category}/${metricDefinition.riskProfile?.metricType}`,
      serviceInstance: metricDefinition.serviceInstanceFieldName,
      lowerBaselineDeviation: metricDefinition.riskProfile?.thresholdTypes?.includes('ACT_WHEN_LOWER') || false,
      higherBaselineDeviation: metricDefinition.riskProfile?.thresholdTypes?.includes('ACT_WHEN_HIGHER') || false,
      groupName: { label: metricDefinition.groupName, value: metricDefinition.groupName }
    })
  }

  setupSource.connectorRef = {
    value: dsConfig.connectorIdentifier as string,
    label: dsConfig.connectorIdentifier as string
  } as any

  return setupSource
}
