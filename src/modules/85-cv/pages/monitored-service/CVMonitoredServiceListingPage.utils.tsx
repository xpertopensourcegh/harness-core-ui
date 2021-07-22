import React from 'react'
import { isNumber } from 'lodash-es'
import Highcharts from 'highcharts'
import { Text, Layout } from '@wings-software/uicore'
import HighchartsReact from 'highcharts-react-official'
import type { Renderer, CellProps } from 'react-table'
import { useStrings, UseStringsReturn } from 'framework/strings'
import type { MonitoredServiceListItemDTO, RiskData } from 'services/cv'
import { getRiskColorValue } from '@common/components/HeatMap/ColorUtils'
import { HealthScoreCard } from './monitoredService.styled'
import type { FilterEnvInterface } from './CVMonitoredServiceListingPage.types'
import { HistoricalTrendChartOption } from './CVMonitoredServiceListingPage.constants'

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
  const zones: Highcharts.SeriesZonesOptionsObject[] = [{ value: undefined, color: currentRiskColor }]

  for (const dataPoint of trendData) {
    const { riskValue, riskStatus } = dataPoint || {}
    const riskColor = getRiskColorValue(riskStatus)
    riskValue && data.push(riskValue)
    if (isNumber(riskValue) && riskStatus) {
      if (riskColor !== currentRiskColor) {
        zones[zones.length - 1].value = riskValue
        zones.push({ value: undefined, color: riskColor })
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
    type: 'line'
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

export const getLabelMapping = (value: string, getString: UseStringsReturn['getString']): string => {
  const LabelRiskMapping: { [key: string]: string } = {
    NO_DATA: getString('noData'),
    NO_ANALYSIS: getString('cv.noAnalysis'),
    LOW: getString('cv.monitoredServices.riskLabel.lowRisk'),
    MEDIUM: getString('cv.monitoredServices.riskLabel.mediumRisk'),
    HIGH: getString('cv.monitoredServices.riskLabel.highRisk')
  }
  return LabelRiskMapping[value]
}

export const RenderHealthTrend: Renderer<CellProps<MonitoredServiceListItemDTO>> = ({ row }) => {
  const rowdata = row?.original
  if (rowdata?.historicalTrend?.healthScores) {
    const chartOptions = getHistoricalTrendChartOption(rowdata?.historicalTrend?.healthScores)
    return <HighchartsReact highcharts={Highcharts} options={chartOptions} />
  }
  return <></>
}

export const RenderHealthScore: Renderer<CellProps<MonitoredServiceListItemDTO>> = ({ row }) => {
  const rowdata = row?.original
  const { getString } = useStrings()
  const { riskStatus, riskValue } = rowdata?.currentHealthScore || {}
  const color = getRiskColorValue(riskStatus)
  return (
    <Layout.Horizontal flex={{ alignItems: 'center', justifyContent: 'flex-start' }}>
      <HealthScoreCard style={{ background: color }}>{riskValue && riskValue > 0 ? riskValue : ''}</HealthScoreCard>
      <Text>{riskStatus && getLabelMapping(riskStatus, getString)}</Text>
    </Layout.Horizontal>
  )
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
