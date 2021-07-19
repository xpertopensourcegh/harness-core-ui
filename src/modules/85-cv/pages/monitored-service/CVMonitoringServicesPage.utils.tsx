import React from 'react'
import { isNumber } from 'lodash-es'
import Highcharts from 'highcharts'
import { Text, Layout } from '@wings-software/uicore'
import HighchartsReact from 'highcharts-react-official'
import type { Renderer, CellProps } from 'react-table'
import type { MonitoredServiceListItemDTO, RiskData } from 'services/cv'
import { getRiskColorValue } from '@common/components/HeatMap/ColorUtils'
import { HealthScoreCard } from './commonStyledComponents'
import type { FilterEnvInterface } from './CVMonitoringServicesPage.types'
import { HistoricalTrendChartOption } from './CVMonitoringServicesPage.constants'

export const getFilterAndEnvironmentValue = (environment: string, searchTerm: string): FilterEnvInterface => {
  const filter: FilterEnvInterface = {}
  if (environment && environment !== 'All') {
    filter['environmentIdentifier'] = environment
  }
  if (searchTerm) {
    filter['searchTerm'] = searchTerm
  }
  return filter
}

export const createTrendDataWithZone = (trendData: RiskData[]): Highcharts.SeriesLineOptions => {
  const data: number[] = []
  let currentRiskColor: string | null = getRiskColorValue(trendData?.[0].riskStatus)
  const zones: Highcharts.SeriesZonesOptionsObject[] = [{ value: trendData?.[0].riskValue, color: currentRiskColor }]
  for (const dataPoint of trendData) {
    const { riskValue, riskStatus } = dataPoint || {}
    const riskColor = getRiskColorValue(riskStatus)
    riskValue && data.push(riskValue)

    if (isNumber(riskValue) && riskStatus) {
      if (riskColor !== currentRiskColor) {
        zones[zones.length - 1].value = riskValue
        zones.push({ value: riskValue, color: riskColor })
        currentRiskColor = riskColor
      }
    } else {
      currentRiskColor = null
    }
  }
  return {
    data,
    zones,
    name: '',
    type: 'line',
    marker: {
      enabled: false
    }
  }
}

export const getHistoricalTrendChartOption = (trendData: RiskData[]): Highcharts.Options => {
  return {
    ...HistoricalTrendChartOption,
    series: [
      {
        ...createTrendDataWithZone(trendData)
      }
    ]
  }
}

export const RenderHealthTrend: Renderer<CellProps<MonitoredServiceListItemDTO>> = ({ row }) => {
  const rowdata = row?.original
  if (rowdata?.historicalTrend?.healthScores) {
    const chartOptions = getHistoricalTrendChartOption(rowdata?.historicalTrend?.healthScores)
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  }
  return <></>
}

export const RenderHealthScore: Renderer<CellProps<MonitoredServiceListItemDTO>> = () => {
  // TODO remove once BE are available
  const rowdata = { currentHealthScore: { riskStatus: '', riskValue: 0 } } // row?.original
  const { riskStatus, riskValue } = rowdata?.currentHealthScore || {}
  if (riskValue && riskValue > 0) {
    const color = getRiskColorValue(riskStatus)
    return (
      <Layout.Horizontal flex={{ alignItems: 'center', justifyContent: 'flex-start' }}>
        <HealthScoreCard style={{ background: color }}>{rowdata?.currentHealthScore}</HealthScoreCard>
        <Text>{riskStatus}</Text>
      </Layout.Horizontal>
    )
  }
  return <></>
}

export const RenderTags: Renderer<CellProps<MonitoredServiceListItemDTO>> = () => {
  // TODO remove once BE are available
  const rowdata = { tags: [] } // row?.original
  return (
    <Layout.Horizontal>
      {rowdata?.tags.map((tag: string) => (
        <Text key={tag}>{tag}</Text>
      ))}
    </Layout.Horizontal>
  )
}
