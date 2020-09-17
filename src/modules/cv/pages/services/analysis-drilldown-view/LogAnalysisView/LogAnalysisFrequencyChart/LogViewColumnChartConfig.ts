import type { SeriesColumnOptions, YAxisOptions } from 'highcharts'
import moment from 'moment'

function getPointWidthBasedOnTimeRange(startTime: number, endTime: number): number {
  switch (Math.round(moment.duration(moment(endTime).diff(startTime)).asHours())) {
    case 4:
      return 30
    case 12:
      return 4
    default:
      return 1
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
        step: 15,
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
        // maxPointWidth: 20,
        pointWidth: getPointWidthBasedOnTimeRange(startTime, endTime)
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
