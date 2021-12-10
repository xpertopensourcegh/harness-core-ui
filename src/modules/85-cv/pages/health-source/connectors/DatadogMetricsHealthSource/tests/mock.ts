import { DatadogProduct } from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/DatadogMetricsHealthSource.utils'
import type { SelectedWidgetMetricData } from '@cv/components/CloudMetricsHealthSource/CloudMetricsHealthSource.type'
import type {
  DatadogMetricInfo,
  DatadogMetricSetupSource
} from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/DatadogMetricsHealthSource.type'
import { HealthSourceTypes } from '@cv/pages/health-source/types'

export const SourceTabsData = {
  accountId: '1234_accountId',
  projectIdentifier: '1234_projectid',
  orgIdentifier: '1234_orgId',
  identifier: 'datadog_source',
  product: DatadogProduct.CLOUD_METRICS,
  name: 'DatadogSource',
  type: 'DATADOG',
  isEdit: false
}
export const MockSampleData = [
  [
    {
      txnName: 'kubernetes.io/container/cpu/core_usage_time',
      metricName: 'kubernetes.io/container/cpu/core_usage_time',
      metricValue: 12.151677124512961,
      timestamp: 1607599860000
    }
  ]
]

export const mockWidgetSelectedData: SelectedWidgetMetricData = {
  metricName: 'MOCK_METRIC_NAME',
  query: 'MOCKED_QUERY',
  widgetName: 'MOCK_WIDGET_NAME',
  dashboardTitle: 'MOCK_DASHBOARD_TITLE',
  dashboardId: 'MOCK_DASHBOARD_ID'
}

export const DatadogMetricsHealthSourceMock = {
  name: 'datadog',
  identifier: 'datadog',
  type: 'DatadogMetrics',
  spec: {
    connectorRef: 'datadogConnector',
    feature: 'Datadog Cloud Metrics',
    metricDefinitions: [
      {
        aggregation: 'avg',
        dashboardId: 'mock_dashboard_id',
        dashboardName: 'mock_dashboard_name',
        groupingQuery: 'mock_grouping_query',
        isManualQuery: true,
        metric: 'mock_active_metric',
        metricName: 'mock_metric_name',
        metricTags: [],
        query: 'mock_query',
        sli: { enabled: false },
        analysis: {
          deploymentVerification: {
            enabled: false,
            serviceInstanceFieldName: ''
          },
          liveMonitoring: {
            enabled: false
          },
          riskProfile: {
            category: 'PERFORMANCE',
            metricType: 'INFRA',
            thresholdTypes: []
          }
        }
      }
    ]
  }
}
export const DatadogMetricsMockHealthSourceData = {
  isEdit: true,
  healthSourceList: [DatadogMetricsHealthSourceMock],
  monitoringSourceName: 'todolist',
  monitoredServiceIdentifier: 'todolist',
  healthSourceName: 'datadog',
  healthSourceIdentifier: 'datadog',
  type: HealthSourceTypes.DatadogMetrics,
  connectorRef: 'datadogConnector',
  product: { label: DatadogProduct.CLOUD_LOGS, value: DatadogProduct.CLOUD_LOGS }
}

const mockMetricDefinitionsMap: Map<string, DatadogMetricInfo> = new Map([
  [
    'mock_metric_name',
    {
      aggregator: 'avg',
      groupName: {
        label: 'mock_dashboard_name',
        value: 'mock_dashboard_name'
      },
      groupingQuery: 'mock_grouping_query',
      higherBaselineDeviation: false,
      id: 'mock_dashboard_id',
      isManualQuery: true,
      lowerBaselineDeviation: false,
      metric: 'mock_active_metric',
      metricName: 'mock_metric_name',
      metricTags: [],
      query: 'mock_query',
      riskCategory: 'PERFORMANCE/INFRA',
      serviceInstanceIdentifierTag: undefined,
      continuousVerification: false,
      healthScore: false,
      sli: false
    }
  ]
])
export const DatadogMetricsSetupSource: DatadogMetricSetupSource = {
  connectorRef: 'datadogConnector',
  healthSourceIdentifier: 'datadog',
  healthSourceName: 'datadog',
  isEdit: true,
  metricDefinition: mockMetricDefinitionsMap,
  product: {
    label: 'Datadog Cloud Logs',
    value: 'Datadog Cloud Logs'
  },
  selectedDashboards: [
    {
      id: 'mock_dashboard_id',
      name: 'mock_dashboard_name'
    }
  ]
}

export const MOCK_MANUAL_QUERIES_LIST = ['mock_metric_name']

export const MOCK_SELECTED_DASHBOARDS_WIDGETS = [
  {
    itemId: 'mock_dashboard_id',
    title: 'mock_dashboard_name'
  }
]

export const MOCK_SELECTED_WIDGET_DATA = {
  metricName: 'mock_metric_name',
  query: 'mock_query',
  widgetName: 'mock_metric_name',
  dashboardTitle: 'datadog_dashboard',
  dashboardId: 'mock_dashboard_id'
}

export const EXPECTED_DATADOG_METRIC_INFO = {
  aggregator: 'avg',
  groupName: {
    label: 'datadog_dashboard',
    value: 'datadog_dashboard'
  },
  id: 'mock_dashboard_id',
  isManualQuery: false,
  metricName: 'mock_metric_name',
  query: 'avg:datadog.agent.running{*}.rollup(avg,60)'
}
