import { DatadogProduct } from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/DatadogMetricsHealthSource.utils'

export const DatadogMetricsMockHealthSource = {
  isEdit: true,
  healthSourceList: [
    {
      name: 'mockHealthSourceName',
      identifier: 'test',
      type: 'DatadogMetrics',
      spec: {
        connectorRef: 'datadog',
        feature: 'Datadog Cloud Metrics',
        metricDefinitions: [
          {
            metricName: 'mockMetricName',
            dashboardId: 'd4d-ahq-k8k',
            dashboardName: 'Test dashboard name'
          }
        ]
      }
    }
  ],
  monitoringSourceName: 'todolist',
  monitoredServiceIdentifier: 'todolist',
  healthSourceName: 'mockHealthSourceName',
  healthSourceIdentifier: 'datadog',
  sourceType: 'DatadogLog',
  connectorRef: 'datadogConnector',
  product: { label: DatadogProduct.CLOUD_METRICS, value: DatadogProduct.CLOUD_METRICS }
}
