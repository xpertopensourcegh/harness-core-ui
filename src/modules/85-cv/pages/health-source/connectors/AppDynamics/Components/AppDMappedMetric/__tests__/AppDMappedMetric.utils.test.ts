import {
  updateSelectedMetricsMap,
  initializeGroupNames,
  getBasePathValue,
  getMetricPathValue
} from '../AppDMappedMetric.utils'
import { appdMetric, mappedMetricsMap, expectedMappedMetrics, formikValues } from './AppDMappedMetric.mock'

describe('Validate  utils functions', () => {
  test('should validate updateSelectedMetricsMap', () => {
    const { selectedMetric, mappedMetrics } = updateSelectedMetricsMap({
      updatedMetric: 'appdMetric new',
      oldMetric: 'appdMetric',
      mappedMetrics: mappedMetricsMap,
      formikValues
    })
    expect(selectedMetric).toEqual('appdMetric new')
    expect(mappedMetrics).toEqual(expectedMappedMetrics)
  })

  test('should validate getBasePathValue and getMetricPathValue', () => {
    expect(getBasePathValue(appdMetric.basePath)).toEqual('Overall Application Performance')
    expect(getMetricPathValue(appdMetric.metricPath)).toEqual('Calls per Minute')
  })

  test('should validate initializeGroupNames', () => {
    expect(initializeGroupNames(mappedMetricsMap, val => val)).toEqual([
      { label: 'cv.addNew', value: '' },
      { label: 'g1', value: 'g1' },
      { label: 'g2', value: 'g2' }
    ])
  })
})
