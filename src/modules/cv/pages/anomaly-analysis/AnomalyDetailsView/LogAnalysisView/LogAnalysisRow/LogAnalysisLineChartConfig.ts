export default function getLogAnalysisLineChartOptions(): Highcharts.Options {
  return {
    chart: {
      renderTo: 'chart',
      margin: 0
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
        color: 'var(--red-500)',
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
      },
      {
        type: 'line',
        color: 'var(--blue-500)',
        name: 'Manufacturing',
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
      }
    ]
  }
}
