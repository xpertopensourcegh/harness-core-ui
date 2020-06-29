import type { SeriesColumnOptions, YAxisOptions, SeriesAreasplineOptions } from 'highcharts'

export default function getLogViewcolumnChartConfig(
  series: SeriesColumnOptions[],
  startTime?: number,
  endTime?: number
): Highcharts.Options {
  const xAxisLabels = [...Array(30).keys()].map(() => new Date().toLocaleTimeString())
  const newSeries: Array<SeriesAreasplineOptions | SeriesColumnOptions> = []

  if (startTime && endTime) {
    // TODO when integrated with heatmap page
  } else {
    newSeries.push({
      name: 'TimeRangeSelection',
      enableMouseTracking: false,
      yAxis: 1,
      type: 'areaspline',
      data: [
        [22.5, 0],
        [22.5, 15],
        [27.5, 15],
        [27.5, 0]
      ]
    })
  }

  newSeries.push(...series)

  return {
    chart: {
      renderTo: 'chart'
    },
    credits: {
      enabled: false
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: xAxisLabels,
      lineWidth: 0,
      labels: {
        step: 6
      },
      showFirstLabel: false,
      alignTicks: false,
      showLastLabel: false
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
        gridLineWidth: 0,
        labels: {
          enabled: false
        }
      },
      {
        title: {
          enabled: false
        } as YAxisOptions,
        min: 0,
        gridLineWidth: 0,
        labels: {
          enabled: false
        }
      }
    ],
    legend: {
      enabled: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false
        }
      },
      areaspline: {
        allowPointSelect: false,
        fillColor: 'var(--blue-200)',
        borderColor: 'var(--blue-500)',
        dashStyle: 'Dash'
      }
    },
    series: newSeries
  }
}
