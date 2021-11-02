import { transactionMetricInfoSummary, transformMetricsExpectedResult } from './DeploymentMetrics.mock'
import { transformMetricData } from '../DeploymentMetrics.utils'

describe('Unit tests for DeploymentMetrics utils', () => {
  test('Ensure transformMetricData works correctly for -1 values', async () => {
    expect(transformMetricData(transactionMetricInfoSummary)).toEqual(transformMetricsExpectedResult)
  })
})
