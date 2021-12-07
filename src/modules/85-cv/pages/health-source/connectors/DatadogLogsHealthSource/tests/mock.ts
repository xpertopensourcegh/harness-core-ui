import type { DatadogLogsQueryDefinition } from '@cv/pages/health-source/connectors/DatadogLogsHealthSource/DatadogLogsHealthSource.type'
import { DatadogProduct } from '@cv/pages/health-source/connectors/DatadogMetricsHealthSource/DatadogMetricsHealthSource.utils'

export const DatadogLogQueryMock1: DatadogLogsQueryDefinition = {
  query: '*',
  serviceInstanceIdentifier: 'todolist',
  name: 'TestDatadogLogQuery',
  indexes: []
}
export const DatadogLogQueryMock2: DatadogLogsQueryDefinition = {
  query: '*',
  serviceInstanceIdentifier: 'todolist',
  name: 'TestDatadogLogQuery2',
  indexes: []
}
export const DatadogLogQueryMock3: DatadogLogsQueryDefinition = {
  query: '*',
  serviceInstanceIdentifier: 'todolist',
  name: 'TestDatadogLogQuery3',
  indexes: []
}
export const DatadogLogMockHealthSource = {
  isEdit: true,
  healthSourceList: [
    {
      name: 'datadog',
      identifier: 'datadog',
      type: 'DatadogLog',
      spec: {
        connectorRef: 'datadogConnector',
        queries: [DatadogLogQueryMock1, DatadogLogQueryMock2]
      },
      service: 'todolist',
      environment: 'production'
    }
  ],
  monitoringSourceName: 'todolist',
  monitoredServiceIdentifier: 'todolist',
  healthSourceName: 'datadog',
  healthSourceIdentifier: 'datadog',
  sourceType: 'DatadogLog',
  connectorRef: 'datadogConnector',
  product: { label: DatadogProduct.CLOUD_LOGS, value: DatadogProduct.CLOUD_LOGS }
}
