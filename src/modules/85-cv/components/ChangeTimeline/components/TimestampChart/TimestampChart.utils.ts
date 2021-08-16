import type { XAxisOptions } from 'highcharts'
import { cloneDeep } from 'lodash-es'
import { TimestampChartHighchartOptions } from './TimestampChart.constants'

export function getTimestampChartConfig(timestamps: number[]): Highcharts.Options {
  const config = cloneDeep(TimestampChartHighchartOptions)
  config.series = [{ data: timestamps, type: 'line' }]
  if (config.xAxis) {
    const xAxisOptions = config.xAxis as XAxisOptions
    xAxisOptions.min = timestamps[0]
    xAxisOptions.max = timestamps[timestamps.length - 1]
  }

  return config
}
