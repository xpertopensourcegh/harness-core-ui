import type { SelectOption, MultiSelectOption } from '@wings-software/uicore'
import type { Scope } from '@common/interfaces/SecretsInterface'
import type { DSConfig, MetricDefinition, TimeSeriesMetricDefinition } from 'services/cv'

export interface PrometheusSetupSource extends DSConfig {
  isEdit: boolean
  mappedServicesAndEnvs: Map<string, MapPrometheusQueryToService> // metricName to MapPrometheusQueryToService
  connectorRef?: {
    label: string
    scope: Scope
    value: string
  }
}

export type MapPrometheusQueryToService = {
  metricName: string
  serviceIdentifier?: SelectOption
  envIdentifier?: SelectOption
  prometheusMetric?: string
  query: string
  isManualQuery: boolean
  serviceFilter?: MultiSelectOption[]
  envFilter?: MultiSelectOption[]
  additionalFilter?: MultiSelectOption[]
  aggregator?: string
  riskCategory?: string
  serviceInstance?: string
  recordCount?: number
  lowerBaselineDeviation?: boolean
  higherBaselineDeviation?: boolean
  groupName?: SelectOption
}

export type RiskProfileCatgory = 'Performance' | 'Errors' | 'Infrastructure'
export type PrometheusFilter = { labelName: string; labelValue: string }

export interface PrometheusMetricDefinition {
  query: string
  serviceIdentifier: string
  envIdentifier: string
  isManualQuery: boolean
  groupName: string
  metricName: string
  serviceInstanceFieldName?: string
  prometheusMetric?: string
  serviceFilter: PrometheusFilter[]
  envFilter: PrometheusFilter[]
  additionalFilters?: PrometheusFilter[]
  aggregation?: string
  riskProfile: {
    category: RiskProfileCatgory
    metricType: MetricDefinition['type']
    thresholdTypes: TimeSeriesMetricDefinition['thresholdType'][]
  }
}

export interface PrometheusDSConfig extends DSConfig {
  metricDefinitions: PrometheusMetricDefinition[]
  type: 'PROMETHEUS'
}

export const PrometheusTabIndex = {
  SELECT_CONNECTOR: 0,
  MAP_QUERIES: 1,
  REVIEW_MAPPINGS: 2
}

export const PrometheusProductNames = {
  APM: 'apm'
}
