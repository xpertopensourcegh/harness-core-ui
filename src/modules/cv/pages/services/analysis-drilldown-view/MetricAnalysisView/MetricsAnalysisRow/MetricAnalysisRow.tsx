import React, { useMemo } from 'react'
import { Container, Text, Icon, Color } from '@wings-software/uikit'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import type { FontProps } from '@wings-software/uikit/dist/styled-props/font/FontProps'
import { isNumber } from 'lodash-es'
import type { MetricData } from 'services/cv'
import { configureMetricTimeSeries } from './MetricAnalysisHighchartConfig'
import css from './MetricAnalysisRow.module.scss'

interface MetricAnalysisRowProps {
  metricName: string
  categoryName: string
  transactionName: string
  analysisData: MetricData[]
  startTime: number
  endTime: number
}

const FONT_SIZE_SMALL: FontProps = {
  size: 'small'
}

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

function transformAnalysisDataToChartSeries(
  analysisData: any[],
  startTime: number,
  endTime: number
): Highcharts.Options {
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

  return configureMetricTimeSeries(
    [{ type: 'line', data: highchartsLineData, zones, zoneAxis: 'x', clip: false, lineWidth: 1 }],
    startTime,
    endTime
  )
}

export default function MetricAnalysisRow(props: MetricAnalysisRowProps): JSX.Element {
  const { metricName, categoryName, analysisData = [], transactionName, startTime, endTime } = props || {}
  const timeseriesOptions = useMemo(() => transformAnalysisDataToChartSeries(analysisData, startTime, endTime), [
    analysisData
  ])
  return (
    <Container className={css.main}>
      <Container background={Color.GREY_100} className={css.metricInfoContainer}>
        <Container className={css.metricAndCategoryNameContainer}>
          <Text color={Color.BLACK} font={FONT_SIZE_SMALL} width={130} lineClamp={1}>
            {`${transactionName} - ${metricName}`}
          </Text>
          <Text font={FONT_SIZE_SMALL}>{categoryName}</Text>
        </Container>
        <Icon name="star-empty" className={css.keyTransaction} color={Color.GREY_250} />
      </Container>
      <Container className={css.highChartContainer}>
        <HighchartsReact highcharts={Highcharts} options={timeseriesOptions} />
      </Container>
    </Container>
  )
}
