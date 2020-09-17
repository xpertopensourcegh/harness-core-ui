import type { SeriesLineOptions } from 'highcharts'

export default function getLogAnalysisLineChartOptions(data: SeriesLineOptions['data']): Highcharts.Options {
  return {
    chart: {
      renderTo: 'chart',
      margin: [0, 10, 0, 10],
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'var(--font-family)'
      }
    },
    credits: undefined,
    title: {
      text: ''
    },
    legend: {
      enabled: false
    },
    xAxis: {
      labels: { enabled: false },
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      title: {
        text: ''
      }
    },
    yAxis: {
      labels: { enabled: false },
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
      },
      line: {
        marker: {
          enabled: false
        }
      }
    },
    tooltip: {
      outside: true
    },
    subtitle: undefined,
    series: [
      {
        type: 'line',
        name: 'Installation',
        data,
        zoneAxis: 'x',
        zones: [
          // {
          //   value: data[Math.floor(Math.random() * 14)].x,
          //   color: 'var(--blue-500)'
          // },
          // {
          //   color: 'var(--red-500)'
          // }
        ]
      }
    ]
  }
}
