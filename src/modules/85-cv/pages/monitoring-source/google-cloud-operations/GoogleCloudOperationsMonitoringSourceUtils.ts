import type { SelectOption } from '@wings-software/uikit'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import type { DSConfig, StackdriverDashboardDTO, TimeSeriesMetricDefinition, MetricPackDTO } from 'services/cv'

export const GCOProduct = {
  CLOUD_METRICS: 'Cloud Metrics'
}

export interface GCOMetricInfo {
  dashboardName?: string
  metricName?: string
  query?: string
  environment?: SelectOption
  service?: SelectOption
  metricTags?: { [key: string]: string }
  riskCategory?: string
  higherBaselineDeviation?: boolean
  lowerBaselineDeviation?: boolean
  isManualQuery?: boolean
}

export interface GCOMonitoringSourceInfo
  extends Omit<DSConfig, 'lastUpdatedAt' | 'activitySourceConfigs' | 'connectorIdentifier'> {
  selectedMetrics: Map<string, GCOMetricInfo>
  selectedDashboards: StackdriverDashboardDTO[]
  connectorRef?: SelectOption
  manuallyInputQueries: string[]
  product: string
  metricPacks: MetricPackDTO[]
}

export interface GCOMetricDefinition {
  metricTags: string[]
  riskProfile: {
    category: 'Performance' | 'Errors' | 'Infrastructure'
    metricType: TimeSeriesMetricDefinition['metricType']
    thresholdTypes: TimeSeriesMetricDefinition['thresholdType'][]
  }
  metricName: string
  dashboardName: string
  isManualQuery?: boolean
  jsonMetricDefinition: object
}

export interface GCODSConfig extends DSConfig {
  serviceIdentifier: string
  metricDefinitions: GCOMetricDefinition[]
  metricPacks: MetricPackDTO[]
}

export function buildGCOMetricInfo({
  dashboardName,
  metricName,
  query,
  metricTags,
  isManualQuery
}: Pick<GCOMetricInfo, 'dashboardName' | 'metricName' | 'query' | 'metricTags' | 'isManualQuery'>): GCOMetricInfo {
  return {
    dashboardName,
    metricName,
    query,
    metricTags,
    isManualQuery
  }
}

export function buildGCOMonitoringSourceInfo(params: ProjectPathProps): GCOMonitoringSourceInfo {
  return {
    identifier: '',
    product: GCOProduct.CLOUD_METRICS,
    monitoringSourceName: 'MyGoogleCloudOperationsSource',
    ...params,
    metricPacks: [],
    manuallyInputQueries: [],
    selectedMetrics: new Map<string, GCOMetricInfo>(),
    selectedDashboards: [],
    type: 'STACKDRIVER'
  }
}
