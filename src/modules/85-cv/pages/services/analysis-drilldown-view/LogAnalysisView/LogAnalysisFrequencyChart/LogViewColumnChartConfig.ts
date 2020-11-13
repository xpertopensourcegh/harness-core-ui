import type { SeriesColumnOptions, YAxisOptions } from 'highcharts'
import moment from 'moment'

function getLabelStepValue(startTime: number, endTime: number): number {
  switch (Math.round(moment.duration(moment(endTime).diff(startTime)).asMinutes())) {
    case 125:
    case 135:
      return 3
    case 150:
      return 4
    case 240:
      return 5
    case 360:
      return 8
    case 720:
      return 10
    case 840:
      return 12
    case 1440:
      return 20
    case 10080:
      return 140
    default:
      return 720
  }
}

export default function getLogViewcolumnChartConfig(
  series: SeriesColumnOptions[],
  categories: number[],
  startTime: number,
  endTime: number
): Highcharts.Options {
  return {
    chart: {
      renderTo: 'chart',
      marginBottom: 5,
      style: {
        fontFamily: 'var(--font-family)'
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: categories.map((timestamp: number) => new Date(timestamp).toLocaleString()),
      lineWidth: 1,
      labels: {
        step: getLabelStepValue(startTime, endTime),
        formatter() {
          return moment(this.value).format('h:mm A')
        },
        style: {
          color: 'var(--grey-400)'
        }
      },
      showFirstLabel: false,
      showLastLabel: false,
      lineColor: 'var(--grey-200)'
    },
    yAxis: [
      {
        min: 0,
        title: {
          enabled: false
        } as YAxisOptions,
        stackLabels: {
          enabled: false
        },
        labels: {
          style: {
            color: 'var(--grey-300)'
          }
        },
        gridLineWidth: 0,
        lineWidth: 1,
        tickWidth: 1,
        tickLength: 7,
        tickAmount: 5,
        tickColor: 'var(--grey-200)',
        lineColor: 'var(--grey-200)'
      }
    ],
    plotOptions: {
      column: {
        groupPadding: 0
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    series
  }
}
