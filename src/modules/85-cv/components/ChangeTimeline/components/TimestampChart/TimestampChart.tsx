import React, { useMemo } from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import type { TimestampChartProps } from './TimestampChart.types'
import { getTimestampChartConfig } from './TimestampChart.utils'

export function TimestampChart(props: TimestampChartProps): JSX.Element {
  const { timestamps } = props
  const options = useMemo(() => getTimestampChartConfig(timestamps || []), [timestamps])
  return <HighchartsReact highcharts={Highcharts} options={options} />
}
