import type { XAxisOptions } from 'highcharts'
import { cloneDeep } from 'lodash-es'
import moment from 'moment'
import { daysTimeFormat, hoursTimeFormat } from './TimestampChart.constants'

export function getTimestampChartConfig(timestamps: number[], timeFormat?: string): Highcharts.Options {
  const config = cloneDeep(getTimestampChartHighchartOptions(timeFormat))
  config.series = [{ data: timestamps, type: 'line' }]
  if (config.xAxis) {
    const xAxisOptions = config.xAxis as XAxisOptions
    xAxisOptions.min = timestamps[0]
    xAxisOptions.max = timestamps[timestamps.length - 1]
  }

  return config
}

export const getTimestampChartHighchartOptions = (format?: string): Highcharts.Options => {
  const timeFormat = getTimeFormat(format)
  return {
    chart: {
      height: 35,
      type: 'line',
      backgroundColor: ''
    },
    credits: { enabled: false },
    title: {
      text: ''
    },
    legend: {
      enabled: false
    },
    xAxis: {
      type: 'datetime',
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      title: {
        text: ''
      },
      labels: {
        formatter: function () {
          return moment(new Date(this.value)).format(timeFormat)
        },
        y: 0,
        style: {
          color: 'var(--grey-300)'
        }
      }
    },
    yAxis: {
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      title: {
        text: ''
      }
    },
    plotOptions: {
      series: {
        stickyTracking: false
      }
    },
    subtitle: undefined,
    series: []
  }
}

export const getTimeFormat = (format?: string): string => {
  let timeFormat = hoursTimeFormat
  switch (format) {
    case 'hours':
      timeFormat = hoursTimeFormat
      break
    case 'days':
      timeFormat = daysTimeFormat
      break
    default:
      timeFormat = hoursTimeFormat
  }

  return timeFormat
}
