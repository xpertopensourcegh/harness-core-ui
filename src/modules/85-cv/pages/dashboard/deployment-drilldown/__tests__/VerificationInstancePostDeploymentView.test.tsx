import get from 'lodash-es/get'
import { mapMetricsData, getSeriesZones } from '../VerificationInstancePostDeploymentView'

jest.mock('moment', () => {
  const original = jest.requireActual('moment')
  original().__proto__.format = () => 'XX:YY'
  return original
})

describe('VerificationInstancePostDeploymentView', () => {
  test('mapMetricsData works correctly', () => {
    const data = mapMetricsData(
      {
        resource: {
          content: [
            {
              groupName: 'testGroupName',
              metricName: 'testMetricName',
              metricDataList: [
                { timestamp: 1605541814220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605541874220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605541934220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605541994220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605542054220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605542114220, value: 10, risk: 'LOW_RISK' },

                { timestamp: 1605542174220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605542234220, value: 10, risk: 'LOW_RISK' },
                { timestamp: 1605542294220, value: 10, risk: 'LOW_RISK' }
              ]
            }
          ]
        }
      },
      1605541814220,
      1605542294220,
      1605542114220
    )
    expect(data[0].transactionName).toEqual('testGroupName')
    expect(data[0].metricName).toEqual('testMetricName')
    expect(get(data[0], 'seriesData[0].series[0].type')).toEqual('line')
    expect(get(data[0], 'chartOptions.xAxis.plotBands[0].from')).toEqual(1605542114220)
  })

  test('getSeriesZones works correctly', () => {
    const zones = getSeriesZones([
      { timestamp: 100, risk: 'LOW_RISK' },
      { timestamp: 200, risk: 'LOW_RISK' },
      { timestamp: 300, risk: 'HIGH_RISK' },
      { timestamp: 400, risk: 'HIGH_RISK' },
      { timestamp: 500, risk: 'LOW_RISK' }
    ])
    expect(zones.length).toEqual(3)
    expect(zones[0].value).toEqual(200)
    expect(zones[1].value).toEqual(400)
    expect(zones[2].value).toEqual(500)
  })
})
