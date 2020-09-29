import React, { useMemo } from 'react'
import { Color, Container } from '@wings-software/uikit'
import { isNumber } from 'lodash-es'
import moment from 'moment'
import type { MetricData } from 'services/cv'
import TimeseriesRow, { SeriesConfig } from 'modules/cv/components/TimeseriesRow/TimeseriesRow'
import css from './MetricAnalysisRow.module.scss'

interface MetricAnalysisRowProps {
  metricName: string
  categoryName?: string
  transactionName: string
  analysisData: MetricData[]
  startTime: number
  endTime: number
}

const ROW_HEIGHT = 60

function riskScoreToColor(riskScore: string): string {
  switch (riskScore) {
    case 'NO_ANALYSIS':
      return 'var(--grey-350)'
    case 'LOW_RISK':
      return 'var(--green-500)'
    case 'MEDIUM_RISK':
      return 'var(--orange-500)'
    default:
      return 'var(--red-500)'
  }
}

function getTimeMaskWidthBasedOnTimeRange(startTime: number, endTime: number): number {
  switch (Math.round(moment.duration(moment(endTime).diff(startTime)).asMinutes())) {
    case 125:
      return 48
    case 135:
      return 73
    case 150:
      return 130
    case 360:
      return 420
    default:
      return 545
  }
}

function transformAnalysisDataToChartSeries(analysisData: any[]): SeriesConfig[] {
  const highchartsLineData = []
  analysisData.sort((a, b) => a.timestamp - b.timestamp)
  let currentRiskColor: string | null = riskScoreToColor(analysisData?.[0].risk)
  const zones: Highcharts.SeriesZonesOptionsObject[] = [{ value: undefined, color: currentRiskColor }]

  for (const dataPoint of analysisData) {
    const { timestamp: x, risk, value: y } = dataPoint || {}
    const riskColor = riskScoreToColor(risk)
    if (isNumber(x) && isNumber(y) && risk) {
      highchartsLineData.push({
        x,
        y
      })
      if (riskColor !== currentRiskColor) {
        zones[zones.length - 1].value = x
        zones.push({ value: undefined, color: riskColor })
        currentRiskColor = riskColor
      }
    } else {
      currentRiskColor = null
      highchartsLineData.push({ x, y: null, color: 'transparent' })
    }
  }

  return [{ series: [{ type: 'line', data: highchartsLineData, zones, zoneAxis: 'x', clip: false, lineWidth: 1 }] }]
}

export default function MetricAnalysisRow(props: MetricAnalysisRowProps): JSX.Element {
  const { metricName, analysisData = [], transactionName, startTime, endTime } = props || {}
  const timeseriesOptions = useMemo(() => transformAnalysisDataToChartSeries(analysisData), [analysisData])
  return (
    <Container className={css.main} height={ROW_HEIGHT}>
      <Container
        style={{ position: 'absolute', top: 0, right: 15, zIndex: 2, opacity: 0.3 }}
        height={ROW_HEIGHT}
        background={Color.BLUE_300}
        width={getTimeMaskWidthBasedOnTimeRange(startTime, endTime)}
      />
      <TimeseriesRow
        transactionName={transactionName}
        metricName={metricName}
        seriesData={timeseriesOptions}
        chartHeight={ROW_HEIGHT}
      />
    </Container>
  )
}
