import type { YAxisOptions, XAxisOptions } from 'highcharts'

export default function getAnomalyScatterPlotOptions(data: number[][]): Highcharts.Options {
  return {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      renderTo: 'chart',
      margin: 0
    },
    credits: {
      enabled: false
    },
    title: {
      text: undefined
    },
    subtitle: {
      text: undefined
    },
    xAxis: {
      title: {
        enabled: false
      } as XAxisOptions,
      showFirstLabel: false,
      showLastLabel: false,
      gridLineColor: 'var(--grey-100)',
      gridLineWidth: 1,
      tickAmount: 15,
      tickLength: 0,
      lineWidth: 0,
      offset: -20,
      labels: {
        useHTML: true,
        style: {
          color: 'var(--grey-350)',
          fontFamily: 'Nunito'
        },
        step: 2
      }
    },
    yAxis: {
      title: {
        enabled: false
      } as YAxisOptions,
      labels: {
        enabled: false
      },
      gridLineColor: 'var(--grey-100)',
      gridLineWidth: 1,
      tickAmount: 15,
      min: 0
    },
    legend: {
      enabled: false
    },
    plotOptions: {},
    series: [
      {
        type: 'scatter',
        name: 'Normal Clusters',
        marker: {
          fillColor: 'var(--grey-200)',
          radius: 5,
          symbol: 'circle',
          lineWidth: 1,
          lineColor: 'var(--grey-300)'
        },
        data
      },
      {
        type: 'scatter',
        name: 'Anomalous Cluster',
        marker: {
          radius: 5,
          fillColor: 'var(--red-450)',
          symbol: 'circle'
        },
        data: [
          [174.0, 65.6],
          [175.3, 71.8],
          [193.5, 80.7],
          [186.5, 72.6],
          [187.2, 78.8],
          [181.5, 74.8],
          [184.0, 86.4],
          [184.5, 78.4],
          [175.0, 62.0],
          [184.0, 81.6],
          [180.0, 76.6],
          [177.8, 83.6],
          [192.0, 90.0],
          [176.0, 74.6],
          [174.0, 71.0],
          [184.0, 79.6],
          [192.7, 93.8],
          [171.5, 70.0],
          [173.0, 72.4],
          [176.0, 85.9],
          [176.0, 78.8],
          [180.5, 77.8],
          [172.7, 66.2],
          [176.0, 86.4],
          [173.5, 81.8],
          [178.0, 89.6],
          [180.3, 82.8],
          [180.3, 76.4],
          [164.5, 63.2],
          [173.0, 60.9],
          [183.5, 74.8],
          [175.5, 70.0],
          [188.0, 72.4],
          [189.2, 84.1],
          [172.8, 69.1],
          [170.0, 59.5],
          [182.0, 67.2],
          [170.0, 61.3],
          [177.8, 68.6],
          [184.2, 80.1],
          [186.7, 87.8],
          [171.4, 84.7],
          [172.7, 73.4],
          [175.3, 72.1],
          [180.3, 82.6],
          [182.9, 88.7],
          [188.0, 84.1],
          [177.2, 94.1],
          [172.1, 74.9],
          [167.0, 59.1],
          [169.5, 75.6],
          [174.0, 86.2],
          [172.7, 75.3],
          [182.2, 87.1],
          [164.1, 55.2],
          [163.0, 57.0],
          [171.5, 61.4],
          [184.2, 76.8],
          [174.0, 86.8],
          [174.0, 72.2],
          [177.0, 71.6],
          [186.0, 84.8],
          [167.0, 68.2],
          [171.8, 66.1],
          [182.0, 72.0],
          [167.0, 64.6],
          [177.8, 74.8],
          [164.5, 70.0],
          [192.0, 101.6],
          [175.5, 63.2],
          [171.2, 79.1],
          [181.6, 78.9],
          [167.4, 67.7],
          [181.1, 66.0],
          [177.0, 68.2],
          [174.5, 63.9],
          [177.5, 72.0],
          [170.5, 56.8],
          [182.4, 74.5],
          [197.1, 90.9],
          [180.1, 93.0],
          [175.5, 80.9],
          [180.6, 72.7]
        ]
      }
    ]
  }
}
