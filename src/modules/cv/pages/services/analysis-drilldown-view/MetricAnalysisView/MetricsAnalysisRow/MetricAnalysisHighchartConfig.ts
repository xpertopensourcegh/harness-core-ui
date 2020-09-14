export function configureMetricTimeSeries(
  series: Highcharts.SeriesLineOptions[],
  startTime: number,
  endTime: number
): Highcharts.Options {
  return {
    chart: {
      backgroundColor: '#FCFCFC',
      type: 'line',
      spacing: [5, 5, 5, 5]
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
      },
      min: startTime,
      max: endTime
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
      formatter: function tooltipFormatter(this: any): string {
        return `<p>${new Date(this.x).toLocaleString()}</p>`
      },
      outside: true
    },
    subtitle: undefined,
    series
  }
}
