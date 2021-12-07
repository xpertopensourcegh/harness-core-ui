import type { DatadogLogsQueryDefinition } from '@cv/pages/health-source/connectors/DatadogLogsHealthSource/DatadogLogsHealthSource.type'

export const DatadogLogQueryMock: DatadogLogsQueryDefinition = {
  query: '*',
  serviceInstanceIdentifier: 'todolist',
  name: 'TestDatadogLogQuery',
  indexes: []
}
export const MockRecordsData = [
  {
    attributes: {
      tags: ['tag1', 'tag2', 'tag3']
    }
  },
  {
    attributes: {
      tags: ['tag1', 'tag2', 'tag3']
    }
  },
  {
    attributes: {
      tags: ['tag1', 'tag2', 'tag3']
    }
  }
]
