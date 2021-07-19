import type { RiskData } from 'services/cv'
import { HistoricalTrendChartOption } from '../CVMonitoringServicesPage.constants'
import { createTrendDataWithZone, getHistoricalTrendChartOption } from '../CVMonitoringServicesPage.utils'

const trendChartMockData: RiskData[] = [
  { riskValue: 2, riskStatus: 'LOW' },
  { riskValue: 4, riskStatus: 'LOW' },
  { riskValue: 8, riskStatus: 'MEDIUM' },
  { riskValue: 16, riskStatus: 'HIGH' }
]
describe('Test util functions', () => {
  test('validare createTrendDataWithZone', () => {
    const trendSeries = createTrendDataWithZone(trendChartMockData)
    const { data, zones } = trendSeries
    expect(data).toEqual([2, 4, 8, 16])
    expect(zones).toEqual([
      {
        color: 'var(--green-500)',
        value: 8
      },
      {
        color: 'var(--orange-500)',
        value: 16
      },
      {
        color: 'var(--red-500)',
        value: 16
      }
    ])

    const trendChartOption = getHistoricalTrendChartOption(trendChartMockData)
    expect(trendChartOption).toEqual({
      ...HistoricalTrendChartOption,
      series: [{ ...trendSeries }]
    })
  })
})
